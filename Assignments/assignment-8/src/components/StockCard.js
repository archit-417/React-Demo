import React, { useState } from 'react';
import { useStock } from '../context/StockCon';
const StockCard = ({ stock }) => {
    const { removeStock, updateShares } = useStock();
    const [editingShares, setEditingShares] = useState(false);
    const [newShares, setNewShares] = useState(stock.shares);
    const value = stock.price * stock.shares;
    
    const dayChange = stock.history && stock.history.length > 1? 
        ((stock.price - stock.history[stock.history.length - 2]?.price) /
        stock.history[stock.history.length - 2]?.price) * 100
        : 0;
    const handleSharesUpdate = () => {
        if (newShares > 0) {
            updateShares(stock.symbol, newShares);
            setEditingShares(false);
        }
    };
    const handleCancelEdit = () => {
        setNewShares(stock.shares);
        setEditingShares(false);
    };
    return (
        <div className="stock-card">
            <div className="stock-header">
                <div className="stock-info">
                    <h3>{stock.symbol}</h3>
                    <p className="stock-name">{stock.name}</p>
                </div>
                <button
                    className="remove-btn"
                    onClick={() => removeStock(stock.symbol)}
                    title="Remove stock"
                >
                    ×
                </button>
            </div>
            <div className="stock-details">
                <div className="price-section">
                    <div className="current-price">${stock.price.toFixed(2)}</div>
                    <div className={`change ${dayChange >= 0 ? 'positive' : 'negative'}`}>
                        {dayChange >= 0 ? '↗' : '↘'} {Math.abs(dayChange).toFixed(2)}%
                    </div>
                </div>
                <div className="shares-section">
                    {editingShares ? (
                        <div className="shares-edit">
                            <input
                                type="number"
                                value={newShares}
                                onChange={(e) => setNewShares(e.target.value)}
                                min="1"
                                className="shares-input"
                            />
                            <button onClick={handleSharesUpdate} className="confirm-btn">✓</button>
                            <button onClick={handleCancelEdit} className="cancel-btn">✕</button>
                        </div>
                    ) : (
                        <div className="shares-display">
                            <span>{stock.shares} shares</span>
                            <button
                                onClick={() => setEditingShares(true)}
                                className="edit-btn"
                                title="Edit shares"
                            >
                                ✎
                            </button>
                        </div>
                    )}
                </div>
                <div className="value-section">
                    <div className="stock-value">${value.toFixed(2)}</div>
                    <div className="value-label">Total Value</div>
                </div>
            </div>
            {stock.history && stock.history.length > 1 && (
                <div className="mini-chart">
                    {stock.history.slice(-10).map((point, index) => {
                        const maxPrice = Math.max(...stock.history.slice(-10).map(p => p.price));
                        const minPrice = Math.min(...stock.history.slice(-10).map(p => p.price));
                        const height = ((point.price - minPrice) / (maxPrice - minPrice)) * 30 || 0;
                        return (
                            <div
                                key={index}
                                className="chart-bar"
                                style={{ height: `${height}px` }}
                                title={`$${point.price.toFixed(2)}`}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};
export default StockCard;