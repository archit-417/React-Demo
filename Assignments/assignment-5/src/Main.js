import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import './App.css';
function Main() {
    return (
        <CartProvider>
            <Router>
                <div className="App">
                    <Navbar />
                    <main>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/cart" element={<Cart />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </CartProvider>
    );
}
export default Main;