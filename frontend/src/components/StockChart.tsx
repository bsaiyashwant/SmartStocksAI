import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface StockChartProps {
    data: any[];
}

export function StockChart({ data }: StockChartProps) {
    if (!data || data.length === 0) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                Waiting for streaming data from Kafka...
            </div>
        );
    }

    // Format data for chart
    const chartData = data.map(d => ({
        time: d.timestamp ? new Date(d.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString(),
        price: d.avg_close || d.Close || 0
    }));

    // Simple min/max for Y axis scaling
    const minPrice = Math.min(...chartData.map(d => d.price)) * 0.999;
    const maxPrice = Math.max(...chartData.map(d => d.price)) * 1.001;

    // Render Premium Area Chart
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                    dataKey="time"
                    stroke="rgba(255,255,255,0.3)"
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                    tickMargin={10}
                />
                <YAxis
                    domain={[minPrice, maxPrice]}
                    stroke="rgba(255,255,255,0.3)"
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                    tickFormatter={(val) => `₹${val.toFixed(0)}`}
                    orientation="right"
                    width={70}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'rgba(15, 17, 26, 0.9)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        color: '#fff'
                    }}
                    itemStyle={{ color: '#fff' }}
                />
                <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                    isAnimationActive={false} // Important for real-time streaming to not feel laggy
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
