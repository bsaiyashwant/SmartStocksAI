import { Briefcase, TrendingUp } from 'lucide-react';

export function Portfolio() {
    const currentInvested = 125000;
    const currentValue = 142350;
    const totalReturn = currentValue - currentInvested;
    const returnPercentage = (totalReturn / currentInvested) * 100;

    const holdings = [
        { symbol: 'RELIANCE', qty: 10, avgPrice: 2400, ltp: 2550 },
        { symbol: 'HDFCBANK', qty: 25, avgPrice: 1500, ltp: 1620 },
        { symbol: 'TCS', qty: 5, avgPrice: 3800, ltp: 3950 },
        { symbol: 'INFY', qty: 15, avgPrice: 1450, ltp: 1390 },
    ];

    return (
        <div className="tab-view portfolio-view">
            <div className="view-header">
                <h2 className="view-title">My Portfolio</h2>
                <p className="text-muted">Track your holdings and overall performance.</p>
            </div>

            <div className="portfolio-summary-row">
                <div className="summary-card">
                    <p className="text-muted">Invested Amount</p>
                    <h3>₹{currentInvested.toLocaleString()}</h3>
                </div>
                <div className="summary-card">
                    <p className="text-muted">Current Value</p>
                    <h3 style={{ color: 'var(--text-main)' }}>₹{currentValue.toLocaleString()}</h3>
                </div>
                <div className="summary-card">
                    <p className="text-muted">Total Returns</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 className="status-up">₹{totalReturn.toLocaleString()}</h3>
                        <span className="status-badge status-up-fade">+{returnPercentage.toFixed(2)}%</span>
                    </div>
                </div>
                <div className="summary-card">
                    <p className="text-muted">1D Returns</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 className="status-up">₹1,250.00</h3>
                        <span className="status-badge status-up-fade">+0.85%</span>
                    </div>
                </div>
            </div>

            <div className="data-table-container">
                <div className="table-header">
                    <h3>Holdings ({holdings.length})</h3>
                    <div className="table-actions">
                        <button className="secondary-btn" onClick={() => alert('Filter Modal Opened (Mock)')}><Briefcase size={16} /> Filter</button>
                        <button className="secondary-btn" onClick={() => alert('Sorting Applied (Mock)')}><TrendingUp size={16} /> Sort</button>
                    </div>
                </div>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Stock</th>
                            <th>Qty</th>
                            <th>Avg. Price</th>
                            <th>LTP</th>
                            <th>Current Value</th>
                            <th>P&L</th>
                        </tr>
                    </thead>
                    <tbody>
                        {holdings.map((h, i) => {
                            const currentVal = h.qty * h.ltp;
                            const invested = h.qty * h.avgPrice;
                            const pnl = currentVal - invested;
                            const isProfit = pnl >= 0;

                            return (
                                <tr key={i}>
                                    <td className="strong">{h.symbol}</td>
                                    <td>{h.qty}</td>
                                    <td>₹{h.avgPrice.toFixed(2)}</td>
                                    <td>₹{h.ltp.toFixed(2)}</td>
                                    <td>₹{currentVal.toLocaleString()}</td>
                                    <td className={isProfit ? 'status-up' : 'status-down'}>
                                        {isProfit ? '+' : ''}₹{pnl.toLocaleString()}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
