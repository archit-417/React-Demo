import React from 'react';
import { StockProvider } from './context/StockCon';
import PortfolioTracker from './PortfolioTracker';
import './styles/App.css';
function Main() {
    return (
        <StockProvider>
            <div className="App">
                <PortfolioTracker />
            </div>
        </StockProvider>
    );
}
export default Main;