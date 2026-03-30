import { useState } from 'react';

interface OrderWindowProps {
    selectedStockState: { symbol: string, ltp: number };
    onTrade: (type: 'BUY' | 'SELL', symbol: string, qty: number, price: number) => boolean;
}

export function OrderWindow({ selectedStockState, onTrade }: OrderWindowProps) {
    const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
    const [productType, setProductType] = useState<'DELIVERY' | 'INTRADAY'>('DELIVERY');
    const [quantity, setQuantity] = useState<number>(1);
    const [priceType, setPriceType] = useState<'MARKET' | 'LIMIT'>('MARKET');

    const estimatedMargin = (selectedStockState.ltp * quantity).toLocaleString(undefined, { minimumFractionDigits: 2 });

    return (
        <div className="order-window glass-panel">
            <div className="order-header">
                <div>
                    <h3>{selectedStockState.symbol}</h3>
                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>NSE</p>
                </div>
                <div className="text-right">
                    <h3 style={{ color: orderType === 'BUY' ? 'var(--status-up)' : 'var(--status-down)' }}>
                        ₹{selectedStockState.ltp.toFixed(2)}
                    </h3>
                    <p className="text-muted status-up" style={{ fontSize: '0.85rem' }}>Live</p>
                </div>
            </div>

            <div className="toggle-group mt-4">
                <button
                    className={`toggle-btn ${orderType === 'BUY' ? 'active-buy' : ''}`}
                    onClick={() => setOrderType('BUY')}
                >
                    BUY
                </button>
                <button
                    className={`toggle-btn ${orderType === 'SELL' ? 'active-sell' : ''}`}
                    onClick={() => setOrderType('SELL')}
                >
                    SELL
                </button>
            </div>

            <div className="product-type-pills mt-4">
                <span className={`pill ${productType === 'DELIVERY' ? 'active' : ''}`} onClick={() => setProductType('DELIVERY')}>Delivery</span>
                <span className={`pill ${productType === 'INTRADAY' ? 'active' : ''}`} onClick={() => setProductType('INTRADAY')}>Intraday</span>
            </div>

            <div className="order-inputs mt-6">
                <div className="input-group-top">
                    <label>Qty <span className="text-muted">NSE</span></label>
                    <input
                        type="number"
                        className="order-input"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                        min="1"
                    />
                </div>

                <div className="input-group-top mt-4">
                    <label>Price <span className="text-muted">Limit</span></label>
                    <input
                        type="number"
                        className="order-input"
                        value={selectedStockState.ltp.toFixed(2)}
                        disabled={priceType === 'MARKET'}
                    />
                </div>

                <div className="market-limit-radios mt-2">
                    <label className="radio-label">
                        <input type="radio" checked={priceType === 'MARKET'} onChange={() => setPriceType('MARKET')} /> Market
                    </label>
                    <label className="radio-label">
                        <input type="radio" checked={priceType === 'LIMIT'} onChange={() => setPriceType('LIMIT')} /> Limit
                    </label>
                </div>
            </div>

            <div className="order-footer mt-6">
                <div className="margin-row">
                    <span className="text-muted">Est. Margin</span>
                    <span className="strong">₹{estimatedMargin}</span>
                </div>

                <button
                    className={`full-width-btn mt-4 ${orderType === 'BUY' ? 'btn-buy' : 'btn-sell'}`}
                    onClick={() => {
                        const price = priceType === 'MARKET' ? selectedStockState.ltp : selectedStockState.ltp; // In real app, limit price comes from input
                        const success = onTrade(orderType, selectedStockState.symbol, quantity, price);
                        if (success) {
                            alert(`Simulation: Successfully placed ${orderType} order for ${quantity} shares of ${selectedStockState.symbol} at ${priceType === 'MARKET' ? 'Market Price' : '₹' + price.toFixed(2)}!`);
                        }
                    }}
                >
                    {orderType} {selectedStockState.symbol}
                </button>
            </div>
        </div>
    );
}
