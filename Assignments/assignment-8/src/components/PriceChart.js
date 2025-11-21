import React, { useState } from 'react';
import { useStock } from '../context/StockCon';
const PriceChart = () => {
    const { stocks } = useStock();
    const [selectedStock, setSelectedStock] = useState(null);
    if (stocks.length === 0) {
        return (
            <div className="price-chart empty">
                <h3>Price History</h3>
                <p>No stocks in portfolio to display chart.</p>
            </div>
        );
    }
    const displayStock = selectedStock || stocks[0];
    const history = displayStock.history || [];
    if (history.length < 2) {
        return (
            <div className="price-chart">
                <div className="chart-header">
                    <h3>Price History</h3>
                    <select
                        value={displayStock.symbol}
                        onChange={(e) => setSelectedStock(stocks.find(s => s.symbol ===
                            e.target.value))}
                    >
                        {stocks.map(stock => (
                            <option key={stock.symbol} value={stock.symbol}>
                                {stock.symbol}
                            </option>
                        ))}
                    </select>
                </div>
                <p>Collecting price data for {displayStock.symbol}...</p>
            </div>
        );
    }
    const prices = history.map(point => point.price);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const chartHeight = 200;
    const chartWidth = 400;
    const getX = (index) => (index / (history.length - 1)) * chartWidth;
    const getY = (price) => chartHeight - ((price - minPrice) / (maxPrice - minPrice)) * chartHeight;
    const pathData = history.map((point, index) => `${index === 0 ? 'M' : 'L'} ${getX(index)} ${getY(point.price)}`).join(' ');
    const currentPrice = displayStock.price;
    const initialPrice = history[0].price;
    const priceChange = currentPrice - initialPrice;
    const percentChange = (priceChange / initialPrice) * 100;
    return (
        <div className="price-chart">
            <div className="chart-header">
                <div className="chart-title">
                    <h3>{displayStock.symbol} Price History</h3>
                    <div className={`price-change ${priceChange >= 0 ? 'positive' :
                        'negative'}`}>
                        {priceChange >= 0 ? '↗' : '↘'} ${Math.abs(priceChange).toFixed(2)}
                        ({percentChange >= 0 ? '+' : ''}{percentChange.toFixed(2)}%)
                    </div>
                </div>
                <select
                    value={displayStock.symbol}
                    onChange={(e) => setSelectedStock(stocks.find(s => s.symbol ===
                        e.target.value))}
                >
                    {stocks.map(stock => (
                        <option key={stock.symbol} value={stock.symbol}>
                            {stock.symbol} - {stock.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="chart-container">
                <svg width={chartWidth} height={chartHeight} className="chart-svg">
                    {/* Grid lines */}
                    <line x1="0" y1="0" x2="0" y2={chartHeight} stroke="#e0e0e0" />
                    <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight}
                        stroke="#e0e0e0" />
                    {/* Price path */}
                    <path d={pathData} stroke="#007bff" strokeWidth="2" fill="none" />
                    {/* Start and end points */}
                    <circle cx={getX(0)} cy={getY(history[0].price)} r="3" fill="#28a745"
                    />
                    <circle cx={getX(history.length - 1)} cy={getY(currentPrice)} r="3"
                        fill="#dc3545" />
                </svg>
            </div>
            <div className="chart-info">
                <div className="info-item">
                    <span className="label">Current Price:</span>
                    <span className="value">${currentPrice.toFixed(2)}</span>
                </div>
                <div className="info-item">
                    <span className="label">Initial Price:</span>
                    <span className="value">${initialPrice.toFixed(2)}</span>
                </div>
                <div className="info-item">
                    <span className="label">Price Range:</span>
                    <span className="value">${minPrice.toFixed(2)} -
                        ${maxPrice.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};
export default PriceChart;