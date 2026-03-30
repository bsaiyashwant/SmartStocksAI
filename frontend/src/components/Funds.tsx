import { Wallet, ArrowDownToLine, ArrowUpFromLine, Clock } from 'lucide-react';
import type { Transaction } from '../App';

export function Funds({ balance, transactions }: { balance: number, transactions: Transaction[] }) {
    const availableMargin = balance;
    const usedMargin = transactions.filter(t => t.type === 'BUY').reduce((acc, t) => acc + t.amount, 0); // Simplified mock metric
    const totalBalance = availableMargin + usedMargin;

    return (
        <div className="tab-view funds-view">
            <div className="view-header">
                <h2 className="view-title">Funds & Margin</h2>
                <p className="text-muted">Manage your trading account balance.</p>
            </div>

            <div className="funds-grid">
                <div className="funds-main-card">
                    <div className="wallet-icon-large">
                        <Wallet size={32} />
                    </div>
                    <p className="text-muted">Available Margin to Trade</p>
                    <h1 className="balance-large">₹{availableMargin.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h1>

                    <div className="funds-actions">
                        <button className="primary-btn flex-grow justify-center" onClick={() => alert('Redirecting to Payment Gateway (Mock)')}><ArrowDownToLine size={18} /> Add Funds</button>
                        <button className="secondary-btn flex-grow justify-center" onClick={() => alert('Withdrawal Request Submitted (Mock)')}><ArrowUpFromLine size={18} /> Withdraw</button>
                    </div>
                </div>

                <div className="funds-breakdown">
                    <h3>Margin Breakdown</h3>

                    <div className="breakdown-row">
                        <span>Opening Balance</span>
                        <span className="strong">₹{totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="breakdown-row">
                        <span>Payin</span>
                        <span className="strong status-up">₹0.00</span>
                    </div>

                    <div className="breakdown-row">
                        <span>Used Margin</span>
                        <span className="strong status-down">-₹{usedMargin.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <hr className="divider" />
                    <div className="breakdown-row">
                        <span className="strong">Available Balance</span>
                        <span className="strong text-main">₹{availableMargin.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
            </div>

            <div className="data-table-container mt-6">
                <div className="table-header">
                    <h3>Recent Transactions</h3>
                </div>

                {transactions.length === 0 ? (
                    <div className="empty-state">
                        <Clock size={48} className="text-muted mb-4" opacity={0.5} />
                        <p className="text-muted">No recent transactions found in the last 30 days.</p>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Symbol</th>
                                <th>Qty</th>
                                <th>Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => (
                                <tr key={tx.id}>
                                    <td>{new Date(tx.date).toLocaleString()}</td>
                                    <td className={tx.type === 'BUY' ? 'status-up strong' : 'status-down strong'}>{tx.type}</td>
                                    <td>{tx.symbol || '-'}</td>
                                    <td>{tx.qty || '-'}</td>
                                    <td className="strong">{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
