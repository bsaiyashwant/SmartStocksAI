import { Filter } from 'lucide-react';

export function FuturesOptions() {
    // Mock options chain data
    const optionsChain = [
        { callOi: 154000, callChg: -1200, callLtp: 145.20, strike: 22000, putLtp: 45.10, putChg: 8500, putOi: 89000 },
        { callOi: 182000, callChg: -4500, callLtp: 112.50, strike: 22050, putLtp: 68.30, putChg: 12000, putOi: 112000 },
        { callOi: 245000, callChg: 1500, callLtp: 85.00, strike: 22100, putLtp: 102.40, putChg: 18500, putOi: 185000 },
        { callOi: 320000, callChg: 12500, callLtp: 62.10, strike: 22150, putLtp: 145.80, putChg: -2000, putOi: 142000 },
        { callOi: 450000, callChg: 45000, callLtp: 42.50, strike: 22200, putLtp: 198.50, putChg: -15000, putOi: 95000 },
    ];

    return (
        <div className="tab-view fno-view">
            <div className="view-header">
                <h2 className="view-title">Futures & Options</h2>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <select className="dropdown-select">
                        <option>NIFTY 50</option>
                        <option>BANKNIFTY</option>
                        <option>FINNIFTY</option>
                    </select>
                    <select className="dropdown-select">
                        <option>28 Mar 2026</option>
                        <option>04 Apr 2026</option>
                    </select>
                </div>
            </div>

            <div className="fno-indices-ticker">
                <div className="ticker-item">
                    <div className="ticker-name">NIFTY 50</div>
                    <div className="ticker-val">22,125.40</div>
                    <div className="ticker-change status-up">+145.20 (0.65%)</div>
                </div>
                <div className="ticker-item">
                    <div className="ticker-name">BANKNIFTY</div>
                    <div className="ticker-val">46,580.90</div>
                    <div className="ticker-change status-up">+320.15 (0.70%)</div>
                </div>
                <div className="ticker-item">
                    <div className="ticker-name">INDIA VIX</div>
                    <div className="ticker-val">15.42</div>
                    <div className="ticker-change status-down">-0.85 (-5.22%)</div>
                </div>
            </div>

            <div className="data-table-container">
                <div className="table-header">
                    <h3>Option Chain (Mock)</h3>
                    <button className="secondary-btn" onClick={() => alert('Greeks View Toggled (Mock)')}><Filter size={16} /> Greeks</button>
                </div>

                <table className="data-table option-chain">
                    <thead>
                        <tr>
                            <th colSpan={3} className="calls-header">CALLS</th>
                            <th className="strike-header">STRIKE</th>
                            <th colSpan={3} className="puts-header">PUTS</th>
                        </tr>
                        <tr>
                            <th>OI (Lakhs)</th>
                            <th>Chng OI</th>
                            <th>LTP</th>
                            <th className="strike-col">PRICE</th>
                            <th>LTP</th>
                            <th>Chng OI</th>
                            <th>OI (Lakhs)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {optionsChain.map((row, i) => {
                            const isItmCall = row.strike <= 22125;
                            const isItmPut = row.strike > 22125;

                            return (
                                <tr key={i}>
                                    <td className={isItmCall ? 'itm-bg' : ''}>{(row.callOi / 100000).toFixed(2)}</td>
                                    <td className={isItmCall ? 'itm-bg' : ''} style={{ color: row.callChg > 0 ? 'var(--status-up)' : 'var(--status-down)' }}>
                                        {row.callChg > 0 ? '+' : ''}{row.callChg}
                                    </td>
                                    <td className={`strong ${isItmCall ? 'itm-bg' : ''}`}>₹{row.callLtp.toFixed(2)}</td>

                                    <td className="strike-col strong">{row.strike}</td>

                                    <td className={`strong ${isItmPut ? 'itm-bg' : ''}`}>₹{row.putLtp.toFixed(2)}</td>
                                    <td className={isItmPut ? 'itm-bg' : ''} style={{ color: row.putChg > 0 ? 'var(--status-up)' : 'var(--status-down)' }}>
                                        {row.putChg > 0 ? '+' : ''}{row.putChg}
                                    </td>
                                    <td className={isItmPut ? 'itm-bg' : ''}>{(row.putOi / 100000).toFixed(2)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
