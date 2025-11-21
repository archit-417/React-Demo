import React, { useState } from 'react';
import { useStock } from '../context/StockCon';
const AddStockForm = () => {
    const { addStock, stocks } = useStock();
    const [formData, setFormData] = useState({
        symbol: '',
        name: '',
        shares: '',
        price: ''
    });
    const [errors, setErrors] = useState({});
    const popularStocks = [
        { symbol: 'TATA', name: 'TATA Inc.', price: 235.50 },
        { symbol: 'GODREJ', name: 'GODREJ Corp.', price: 475.00 },
        { symbol: 'LUCAS', name: 'LUCAS', price: 155.75 },
        { symbol: 'PARIBAS', name: 'PARIBAS.', price: 335.20 },
        { symbol: 'ENCORA', name: 'ENCORA.', price: 495.30 }
    ];
    const validateForm = () => {
        const newErrors = {};
        if (!formData.symbol.trim()) {
            newErrors.symbol = 'Stock symbol is required';
        } else if (stocks.find(s => s.symbol === formData.symbol.toUpperCase())) {
            newErrors.symbol = 'Stock already in portfolio';
        }
        if (!formData.name.trim()) {
            newErrors.name = 'Company name is required';
        }
        if (!formData.shares || parseInt(formData.shares) <= 0) {
            newErrors.shares = 'Must have at least 1 share';
        }
        if (!formData.price || parseFloat(formData.price) <= 0) {
            newErrors.price = 'Price must be greater than 0';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            addStock(
                formData.symbol,
                formData.name,
                formData.shares,
                formData.price
            );
            setFormData({ symbol: '', name: '', shares: '', price: '' });
            setErrors({});
        }
    };
    const handlePopularStockSelect = (stock) => {
        setFormData({
            symbol: stock.symbol,
            name: stock.name,
            price: stock.price,
            shares: '1'
        });
        setErrors({});
    };
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };
    return (
        <div className="add-stock-form">
            <h3>Add New Stock</h3>
            <div className="popular-stocks">
                <p>Quick add:</p>
                <div className="popular-stocks-list">
                    {popularStocks.map(stock => (
                        <button
                            key={stock.symbol}
                            className="popular-stock-btn"
                            onClick={() => handlePopularStockSelect(stock)}
                        >
                            {stock.symbol}
                        </button>
                    ))}
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label>Stock Symbol *</label>
                        <input
                            type=""
                            value={formData.symbol}
                            onChange={(e) => handleChange('symbol',
                                e.target.value.toUpperCase())}
                            placeholder="e.g., AAPL"
                            className={errors.symbol ? 'error' : ''}
                        />
                        {errors.symbol && <span className="error-">{errors.symbol}</span>}
                    </div>
                    <div className="form-group">
                        <label>Company Name *</label>
                        <input
                            type=""
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="e.g., TATA CORP."
                            className={errors.name ? 'error' : ''}
                        />
                        {errors.name && <span className="error-">{errors.name}</span>}
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Shares *</label>
                        <input
                            type="number"
                            value={formData.shares}
                            onChange={(e) => handleChange('shares', e.target.value)}
                            placeholder="e.g., 10"
                            min="1"
                            className={errors.shares ? 'error' : ''}
                        />
                        {errors.shares && <span className="error-">{errors.shares}</span>}
                    </div>
                    <div className="form-group">
                        <label>Price per Share (Rs.) *</label>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => handleChange('price', e.target.value)}
                            placeholder="e.g., 150.00"
                            step="0.01"
                            min="0.01"
                            className={errors.price ? 'error' : ''}
                        />
                        {errors.price && <span className="error-">{errors.price}</span>}
                    </div>
                </div>
                <button type="submit" className="add-btn">
                    Add to Portfolio
                </button>
            </form>
        </div>
    );
};
export default AddStockForm;