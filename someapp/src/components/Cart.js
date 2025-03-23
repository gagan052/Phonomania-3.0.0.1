import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:8080/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      setCartItems(data.items || []);
    } catch (error) {
      setError('Failed to load cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, change) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const item = cartItems.find(item => item.product._id === productId);
      const newQuantity = Math.max(1, item.quantity + change);

      const response = await fetch(`http://localhost:8080/api/cart/update/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update quantity');
      }

      const updatedCart = await response.json();
      setCartItems(updatedCart.items || []);
    } catch (error) {
      setError(error.message);
    }
  };

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:8080/api/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to remove item');
      }

      const updatedCart = await response.json();
      setCartItems(updatedCart.items || []);
    } catch (error) {
      setError(error.message);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal >= 200 ? 0 : 10;
  const total = subtotal + shipping;
  const remainingForFreeShipping = Math.max(0, 200 - subtotal);

  if (loading) {
    return (
      <div className="cart-container">
        <h1 className="cart-title">Loading cart...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-container">
        <h1 className="cart-title">Error</h1>
        <p className="error-message">{error}</p>
        <button className="continue-shopping" onClick={fetchCart}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Shopping Cart</h1>
      
      {cartItems.length > 0 ? (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => (
                <div
                  key={item.product._id}
                  className="cart-item fade-in"
                >
                  <div className="item-image-container">
                    <img src={item.product.image} alt={item.product.name} className="item-image" />
                  </div>
                  <div className="item-details">
                    <h3>{item.product.name}</h3>
                    <p className="item-description">{item.product.description || 'No description available'}</p>
                    <div className="item-price-quantity">
                      <p className="item-price">${item.price.toFixed(2)}</p>
                      <div className="quantity-controls">
                        <button
                          onClick={() => updateQuantity(item.product._id, -1)}
                          className="quantity-btn"
                          disabled={item.quantity <= 1}
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id, 1)}
                          className="quantity-btn"
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="item-total">
                    <p className="total-price">${(item.price * item.quantity).toFixed(2)}</p>
                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="remove-btn"
                    >
                      <i className="fas fa-trash-alt"></i> Remove
                    </button>
                  </div>
                </div>
              ))}
          </div>

          <div className="cart-summary fade-in">
            <h2><i className="fas fa-shopping-cart"></i> Order Summary</h2>
            {remainingForFreeShipping > 0 && (
              <div className="shipping-progress">
                <p>
                  <i className="fas fa-truck"></i>
                  Add ${remainingForFreeShipping.toFixed(2)} more for free shipping!
                </p>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(subtotal / 200) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
            <div className="summary-details">
              <div className="summary-row">
                <span><i className="fas fa-receipt"></i> Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span><i className="fas fa-shipping-fast"></i> Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="summary-row total">
                <span><i className="fas fa-money-bill-wave"></i> Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button className="checkout-btn">
              <i className="fas fa-lock"></i> Secure Checkout
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add some products to your cart to see them here!</p>
          <button className="continue-shopping">Continue Shopping</button>
        </div>
      )}
    </div>
  );
};

export default Cart;