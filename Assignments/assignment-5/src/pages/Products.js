import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import './Products.css';
const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    // Mock product data - in real app, you'd fetch from API
    useEffect(() => {
        const mockProducts = [
            {
                id: 1,
                name: 'Wireless Headphones',
                price: 99.99,
                image: 'https://picsum.photos/id/1080/300/300'
            },
            {
                id: 2,
                name: 'Smart Watch',
                price: 199.99,
                image: 'https://picsum.photos/id/175/300/300'
            },
            {
                id: 3,
                name: 'Laptop Backpack',
                price: 49.99,
                image: 'https://picsum.photos/id/21/300/300'
            },
            {
                id: 4,
                name: 'Bluetooth Speaker',
                price: 79.99,
                image: 'https://picsum.photos/id/39/300/300'
            },
            {
                id: 5,
                name: 'Phone Case',
                price: 19.99,
                image: 'https://picsum.photos/id/60/300/300'
            },
            {
                id: 6,
                name: 'Tablet Stand',
                price: 29.99,
                image: 'https://picsum.photos/id/119/300/300'
            }
        ];
        setTimeout(() => {
            setProducts(mockProducts);
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) {
        return <div className="loading">Loading products...</div>;
    }
    return (
        <div className="products-page">
            <h1>Our Products</h1>
            <div className="products-grid">
                {products.map(product => (
                    <div key={product.id} className="product-card">
                        <img src={product.image} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p className="price">Rs.{product.price}</p>
                        <button
                            onClick={() => addToCart(product)}
                            className="add-to-cart-btn"
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Products;