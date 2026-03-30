# SmartStocks AI 📈🚀

This project is a modern, enterprise-grade Stock Market Big Data engineering pipeline. It simulates real-time data ingestion, processing, and visualization using industry-standard tools: **Apache Kafka**, **PySpark Structured Streaming**, **FastAPI (WebSockets)**, and a **Vite + React** frontend.

## 🏗 Architecture

1. **Producer (`producer.py`)**: Fetches live stock data for multiple tickers using `yfinance` every 10 seconds and pushes it to an Apache Kafka topic (`raw_stock_data`).
2. **Spark Streaming Engine (`spark_streaming.py`)**: Reads the raw data stream from Kafka, applies 1-minute tumbling window aggregations (Average Close, Max High, Min Low, Volume), and writes the processed analytics to a new Kafka topic (`processed_stock_data`).
3. **API Backend (`main.py`)**: A FastAPI application that consumes the processed aggregated messages from Kafka and instantly broadcasts them to all connected frontend clients via WebSockets (`ws://localhost:8000/ws`).
4. **Frontend (`frontend/`)**: A sleek, dark-mode React application powered by Vite, tailwind-like CSS modules, and Recharts. It connects to the WebSocket to dynamically render a live trading dashboard with premium "glassmorphism" aesthetics.

## ⚙️ Prerequisites

- Python 3.8+
- Node.js & npm (v18+)
- Docker & Docker Compose (for running Kafka and Zookeeper locally)
- Java 8 or 11 (required to run PySpark locally)

## 🚀 How to Run the Infrastructure

### 1. Start Kafka & Zookeeper (Docker)
Open a terminal in the project root and run:
```bash
docker-compose up -d
```
*Wait for a few seconds to ensure Kafka gets fully up and running.*

### 2. Setup Python Environment & Install Requirements
```bash
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Start Data Producer
In a dedicated terminal (with the virtualenv activated), run:
```bash
python producer.py
```

### 4. Start PySpark Streaming
In another terminal (with the virtualenv activated), run the Spark streaming job. Note that we include the necessary Kafka packages:
```bash
python spark_streaming.py
```

### 5. Start the FastAPI WebSocket Backend
In another terminal (with the virtualenv activated), start the FastAPI server using Uvicorn:
```bash
uvicorn main:app --reload --port 8000
```

### 6. Start the React Frontend
In a final terminal, navigate to the `frontend` folder, install dependencies, and start the Vite dev server:
```bash
cd frontend
npm install
npm run dev
```

The stunning interactive dashboard will be available at: **`http://localhost:5173`** 🌍✨

---
### ⚠️ Troubleshooting PySpark on Windows
If you run into issues running Spark on Windows (like `winutils.exe` errors), please ensure you have Hadoop binaries configured globally, or ignore the warnings if the streaming still executes successfully.
