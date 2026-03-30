import { useState, useEffect } from 'react'
import { TrendingUp, Activity, BarChart2, DollarSign, Loader2, Server, Clock } from 'lucide-react'
import { StockChart } from './StockChart'
import { OrderWindow } from './OrderWindow'

interface StockData {
  Symbol: string;
  Date: string;
  Open: number;
  High: number;
  Low: number;
  Close: number;
  Volume: number;
  avg_close?: number;
  max_price?: number;
  min_price?: number;
  total_volume?: number;
  timestamp?: string;
}

const WEBSOCKET_URL = "ws://localhost:8000/ws";
const STOCKS = ["SBIN.NS", "HDFCBANK.NS", "RELIANCE.NS", "INFY.NS", "TCS.NS"];

export function Dashboard({ onTrade }: { onTrade: (type: 'BUY' | 'SELL', symbol: string, qty: number, price: number) => boolean }) {
  const [selectedStock, setSelectedStock] = useState("SBIN.NS");
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [latestMetrics, setLatestMetrics] = useState<Partial<StockData> | null>(null);

  useEffect(() => {
    const ws = new WebSocket(WEBSOCKET_URL);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.Symbol === selectedStock) {
          setLatestMetrics(data);
          setStockData(prev => {
            const newData = [...prev, data];
            if (newData.length > 50) return newData.slice(newData.length - 50);
            return newData;
          });
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket");
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [selectedStock]);

  const handleStockChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStock(e.target.value);
    setStockData([]);
    setLatestMetrics(null);
  };

  const getSignal = () => {
    if (stockData.length < 5) return { text: "HOLD", class: "signal-hold" };

    const recent = stockData.slice(-5);
    const avgRecent = recent.reduce((sum, d) => sum + (d.avg_close ?? d.Close ?? 0), 0) / 5;

    const latestVal = latestMetrics?.avg_close ?? latestMetrics?.Close ?? 0;
    if (latestMetrics && latestVal > avgRecent) {
      return { text: "BUY", class: "signal-buy" };
    } else {
      return { text: "SELL", class: "signal-sell" };
    }
  };

  const signal = getSignal();
  const currentPrice = latestMetrics?.avg_close ?? 0;

  return (
    <div className="dashboard-grid">
      <div className="left-column">
        <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="view-title">Market Overview</h2>
            <div className="connection-status">
              {isConnected ? (
                <span className="status-up"><span className="live-dot-inline"></span> Spark Stream Active ({latestMetrics?.timestamp ? new Date(latestMetrics.timestamp).toLocaleTimeString() : 'Waiting'})</span>
              ) : (
                <span className="status-down"><Server size={14} style={{ display: 'inline', marginRight: 4 }} /> Offline</span>
              )}
            </div>
          </div>

          <select
            className="stock-selector-clean"
            value={selectedStock}
            onChange={handleStockChange}
          >
            {STOCKS.map(s => (
              <option key={s} value={s}>{s.replace('.NS', '')}</option>
            ))}
          </select>
        </div>

        <div className="metrics-row-clean">
          <div className="metric-box">
            <span className="text-muted text-sm">Avg Close Price</span>
            <h3>
              {latestMetrics?.avg_close ? `₹${latestMetrics.avg_close.toFixed(2)}` : <Loader2 size={18} className="spin" />}
            </h3>
          </div>
          <div className="metric-box">
            <span className="text-muted text-sm">Max Traded High</span>
            <h3 className="status-up">
              {latestMetrics?.max_price ? `₹${latestMetrics.max_price.toFixed(2)}` : '--'}
            </h3>
          </div>
          <div className="metric-box">
            <span className="text-muted text-sm">1Min Volume</span>
            <h3>
              {latestMetrics?.total_volume ? latestMetrics.total_volume.toLocaleString() : '--'}
            </h3>
          </div>
          <div className="metric-box">
            <span className="text-muted text-sm">Algorithm Signal</span>
            <span className={`signal-badge-small ${signal.class}`}>{signal.text}</span>
          </div>
        </div>

        <div className="chart-wrapper">
          <StockChart data={stockData} />
        </div>
      </div>

      <div className="right-column">
        <OrderWindow selectedStockState={{ symbol: selectedStock.replace('.NS', ''), ltp: currentPrice }} onTrade={onTrade} />
      </div>
    </div>
  );
}
