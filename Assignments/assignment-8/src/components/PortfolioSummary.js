import React from 'react';
import { useStock } from '../context/StockCon';
const PortfolioSummary = () => {
    const {
        stocks,
        getPortfolioValue,
        getTotalInvested,
        getPortfolioReturn,
        clearPortfolio
    } = useStock();
    const portfolioValue = getPortfolioValue();
    const totalInvested = getTotalInvested();
    const portfolioReturn = getPortfolioReturn();
    const absoluteReturn = portfolioValue - totalInvested;
    const topPerformer = stocks.length > 0
        ? stocks.reduce((top, stock) => {
            const stockReturn = stock.history && stock.history.length > 1
                ? ((stock.price - stock.history[0].price) / stock.history[0].price) *
                100
                : 0;
            return stockReturn > top.return ? {
                symbol: stock.symbol, return:
                    stockReturn
            } : top;
        }, { symbol: '', return: -Infinity })
        : null;
    if (stocks.length === 0) {
        return (
            <div className="portfolio-summary empty">
                <h2>Portfolio Summary</h2>
                <p>Add stocks to your portfolio to see summary information.</p>
            </div>
        );
    }
    return (
        <div className="portfolio-summary">
            <div className="summary-header">
                <h2>Portfolio Summary</h2>
                <button
                    onClick={clearPortfolio}
                    className="clear-portfolio-btn"
                    title="Clear all stocks"
                >
                    Clear Portfolio
                </button>
            </div>
            <div className="summary-grid">
                <div className="summary-card total-value">
                    <h3>Total Value</h3>
                    <div className="amount">${portfolioValue.toFixed(2)}</div>
                    <div className="label">Current Portfolio Value</div>
                </div>
                <div className="summary-card total-invested">
                    <h3>Total Invested</h3>
                    <div className="amount">${totalInvested.toFixed(2)}</div>
                    <div className="label">Total Amount Invested</div>
                </div>
                <div className={`summary-card returns ${absoluteReturn >= 0 ? 'positive'
                    : 'negative'}`}>
                    <h3>Total Return</h3>
                    <div className="amount">
                        {absoluteReturn >= 0 ? '+' : ''}${absoluteReturn.toFixed(2)}
                    </div>
                    <div className="percentage">
                        ({portfolioReturn >= 0 ? '+' : ''}{portfolioReturn.toFixed(2)}%)
                    </div>
                </div>
                <div className="summary-card stocks-count">
                    <h3>Stocks Held</h3>
                    <div className="amount">{stocks.length}</div>
                    <div className="label">Different Stocks</div>
                </div>
            </div>
            {topPerformer && topPerformer.return > -Infinity && (
                <div className="performance-highlight">
                    <span className="highlight-label">Top Performer:</span>
                    <span className="highlight-stock">{topPerformer.symbol}</span>
                    <span className={`highlight-return ${topPerformer.return >= 0 ?
                        'positive' : 'negative'}`}>
                        {topPerformer.return >= 0 ? '+' :
                            ''}{topPerformer.return.toFixed(2)}%
                    </span>
                </div>
            )}
        </div>
    );
};
export default PortfolioSummary;