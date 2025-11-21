import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Navbar.css';
export default function Navbar() {
    const { getCartItemsCount } = useCart();
    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    ShopEasy
                </Link>
                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/products" className="nav-link">Products</Link>
                    <Link to="/cart" className="nav-link cart-link">
                        Cart ({getCartItemsCount()})
                    </Link>
                </div>
            </div>
        </nav>
    );
}