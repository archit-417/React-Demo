import React from 'react';
import { useStock } from './context/StockCon';
import PortfolioSummary from './components/PortfolioSummary';
import AddStockForm from './components/AddStockForm';
import StockCard from './components/StockCard';
import PriceChart from './components/PriceChart';
import './styles/PortfolioTracker.css';
const PortfolioTracker = () => {
    const { stocks } = useStock();
    return (
        <div className="portfolio-tracker">
            <header className="portfolio-header">
                <h1> Stock Portfolio Tracker</h1>
                <p>Track your investments in real-time with live price updates</p>
            </header>
            <div className="portfolio-layout">
                <div className="main-content">
                    <PortfolioSummary />
                    <div className="stocks-section">
                        <h2>Your Stocks ({stocks.length})</h2>
                        {stocks.length === 0 ? (
                            <div className="empty-portfolio">
                                <div className="empty-icon"> </div>
                                <h3>Your portfolio is empty</h3>
                                <p>Add your first stock to start tracking!</p>
                            </div>
                        ) : (
                            <div className="stocks-grid">
                                {stocks.map(stock => (
                                    <StockCard key={stock.symbol} stock={stock} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="sidebar">
                    <AddStockForm />
                    <PriceChart />
                </div>
            </div>
        </div>
    );
};
export default PortfolioTracker;