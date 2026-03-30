import json
import time
import logging
import yfinance as yf
from confluent_kafka import Producer

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Kafka Configuration
KAFKA_BROKER = 'localhost:29092'
TOPIC_NAME = 'raw_stock_data'

# Producer configuration
conf = {
    'bootstrap.servers': KAFKA_BROKER,
    'client.id': 'stock-data-producer'
}

producer = Producer(conf)

def delivery_report(err, msg):
    """ Called once for each message produced to indicate delivery result.
        Triggered by poll() or flush(). """
    if err is not None:
        logger.error(f'Message delivery failed: {err}')
    else:
        logger.debug(f'Message delivered to {msg.topic()} [{msg.partition()}]')

def fetch_and_send_data(symbol: str):
    try:
        ticker = yf.Ticker(symbol)
        # Fetch last 1 minute data
        df = ticker.history(period="1d", interval="1m")

        if df.empty:
            logger.warning(f"No data fetched for {symbol}")
            return

        df.reset_index(inplace=True)
        # Format dates properly
        df['Date'] = df['Datetime'].dt.strftime('%Y-%m-%d %H:%M:%S')
        
        # Get the latest row
        latest_data = df.iloc[-1]
        
        payload = {
            "Symbol": symbol,
            "Date": latest_data["Date"],
            "Open": float(latest_data["Open"]),
            "High": float(latest_data["High"]),
            "Low": float(latest_data["Low"]),
            "Close": float(latest_data["Close"]),
            "Volume": int(latest_data["Volume"])
        }

        # Send to Kafka
        producer.produce(
            TOPIC_NAME, 
            key=symbol.encode('utf-8'), 
            value=json.dumps(payload).encode('utf-8'), 
            callback=delivery_report
        )
        producer.poll(0)
        logger.info(f"Produced: {payload}")

    except Exception as e:
        logger.error(f"Error fetching data for {symbol}: {e}")

if __name__ == "__main__":
    symbols = ["SBIN.NS", "HDFCBANK.NS", "RELIANCE.NS", "INFY.NS", "TCS.NS"]
    logger.info("Starting Data Producer...")
    
    try:
        while True:
            for symbol in symbols:
                fetch_and_send_data(symbol)
            # Flush to ensure all messages are delivered
            producer.flush()
            
            # Wait 10 seconds before fetching again
            logger.info("Waiting for next cycle...")
            time.sleep(10)
    except KeyboardInterrupt:
        logger.info("Producer stopped by user.")
    except Exception as e:
        logger.error(f"Producer encountered error: {e}")
    finally:
        producer.flush()
