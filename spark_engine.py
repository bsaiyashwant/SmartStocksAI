from pyspark.sql import SparkSession
from pyspark.sql.functions import avg, max, min, sum
import streamlit as st


# ✅ Create Spark session safely for Streamlit
@st.cache_resource
def get_spark():
    spark = (
        SparkSession.builder
        .appName("StockBigDataEngine")
        .master("local[*]")
        .config("spark.driver.memory", "2g")
        .getOrCreate()
    )
    spark.sparkContext.setLogLevel("ERROR")
    return spark


def analyze_with_spark(df):
    spark = get_spark()

    sdf = spark.createDataFrame(df)

    result = sdf.groupBy("Symbol").agg(
        avg("Close").alias("avg_close"),
        max("High").alias("max_price"),
        min("Low").alias("min_price"),
        sum("Volume").alias("total_volume")
    )

    return result.toPandas()