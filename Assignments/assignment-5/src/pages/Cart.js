import React from 'react';
import { useCart } from '../context/CartContext';
import './Cart.css';
const Cart = () => {
    const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
    if (cart.items.length === 0) {
        return (
            <div className="cart-page">
                <h1>Your Cart</h1>
                <div className="empty-cart">
                    <p>Your cart is empty</p>
                </div>
            </div>
        );
    }
    return (
        <div className="cart-page">
            <h1>Your Cart</h1>
            <div className="cart-items">
                {cart.items.map(item => (
                    <div key={item.id} className="cart-item">
                        <img src={item.image} alt={item.name} />
                        <div className="item-details">
                            <h3>{item.name}</h3>
                            <p>Rs. {item.price}</p>
                        </div>
                        <div className="quantity-controls">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                -
                            </button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                +
                            </button>
                        </div>
                        <div className="item-total">
                            Rs. {(item.price * item.quantity).toFixed(2)}
                        </div>
                        <button
                            onClick={() => removeFromCart(item.id)}
                            className="remove-btn"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
            <div className="cart-summary">
                <div className="total">
                    <h3>Total: Rs.{getCartTotal().toFixed(2)}</h3>
                </div>
                <div className="cart-actions">
                    <button onClick={clearCart} className="clear-btn">
                        Clear Cart
                    </button>
                    <button className="checkout-btn">
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};
export default Cart;