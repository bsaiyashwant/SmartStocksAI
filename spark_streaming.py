import json
import logging
import os
# Ignore global Spark installation to prevent py4j version mismatch
if "SPARK_HOME" in os.environ:
    del os.environ["SPARK_HOME"]

from pyspark.sql import SparkSession
from pyspark.sql.functions import from_json, col, window, avg, max, min, sum, current_timestamp
from pyspark.sql.types import StructType, StructField, StringType, DoubleType, LongType, TimestampType

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

KAFKA_BROKER = "localhost:29092"
INPUT_TOPIC = "raw_stock_data"
OUTPUT_TOPIC = "processed_stock_data"

def create_spark_session():
    return (SparkSession.builder
            .appName("StockDataStreaming")
            .master("local[*]")
            .config("spark.jars.packages", "org.apache.spark:spark-sql-kafka-0-10_2.12:3.5.0")
            .config("spark.sql.streaming.checkpointLocation", "./checkpoints")
            .getOrCreate())

def process_stream():
    spark = create_spark_session()
    spark.sparkContext.setLogLevel("ERROR")
    logger.info("Spark Session created successfully.")

    # Define schema of the incoming JSON payload
    schema = StructType([
        StructField("Symbol", StringType(), True),
        StructField("Date", StringType(), True),
        StructField("Open", DoubleType(), True),
        StructField("High", DoubleType(), True),
        StructField("Low", DoubleType(), True),
        StructField("Close", DoubleType(), True),
        StructField("Volume", LongType(), True)
    ])

    # Read stream from Kafka
    raw_stream = (spark.readStream
                  .format("kafka")
                  .option("kafka.bootstrap.servers", KAFKA_BROKER)
                  .option("subscribe", INPUT_TOPIC)
                  .option("startingOffsets", "latest")
                  .load())

    # Parse JSON values
    parsed_stream = raw_stream.selectExpr("CAST(value AS STRING)").select(
        from_json(col("value"), schema).alias("data")
    ).select("data.*")
    
    # Add a processing timestamp for windowing
    stream_with_time = parsed_stream.withColumn("processing_time", current_timestamp())

    # 1-minute tumbling window aggregations
    aggregated_stream = (stream_with_time
                         .withWatermark("processing_time", "1 minute")
                         .groupBy(window(col("processing_time"), "1 minute"), col("Symbol"))
                         .agg(
                             avg("Close").alias("avg_close"),
                             max("High").alias("max_price"),
                             min("Low").alias("min_price"),
                             sum("Volume").alias("total_volume"),
                             avg("Close").alias("latest_close") # Simplified
                         ))

    # Formatting output for Kafka
    # Convert structs to JSON string
    from pyspark.sql.functions import to_json, struct
    kafka_output = aggregated_stream.select(
        col("Symbol").alias("key"),
        to_json(struct(
            col("Symbol"),
            col("avg_close"),
            col("max_price"),
            col("min_price"),
            col("total_volume"),
            col("window.end").alias("timestamp")
        )).alias("value")
    )

    # Write processed stream back to Kafka
    query = (kafka_output.writeStream
             .format("kafka")
             .option("kafka.bootstrap.servers", KAFKA_BROKER)
             .option("topic", OUTPUT_TOPIC)
             .outputMode("update")
             .start())

    logger.info("Streaming query started. Awaiting termination...")
    query.awaitTermination()

if __name__ == "__main__":
    process_stream()
