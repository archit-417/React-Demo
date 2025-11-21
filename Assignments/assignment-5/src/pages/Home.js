import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
export default function Home(){
    return (
        <div className="home">
            <section className="hero">
                <div className="hero-content">
                    <h1>Welcome to ShopEasy</h1>
                    <p>Discover amazing products at great prices</p>
                    <Link to="/products" className="cta-button">
                        Shop Now
                    </Link>
                </div>
            </section>
            <section className="features">
                <div className="feature">
                    <h3>Free Shipping</h3>
                    <p>On orders over $50</p>
                </div>
                <div className="feature">
                    <h3>24/7 Support</h3>
                    <p>We're here to help</p>
                </div>
                <div className="feature">
                    <h3>Easy Returns</h3>
                    <p>30-day return policy</p>
                </div>
            </section>
        </div>
    );
};