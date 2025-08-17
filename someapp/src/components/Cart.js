import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';
import apiService from '../utils/new-request';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const clearError = () => setError(null);

  const fetchCart = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await apiService.getCart();
      setCartItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to load cart. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQuantity = async (productId, change) => {
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const item = cartItems.find(item => item.product._id === productId);
      const newQuantity = Math.max(1, item.quantity + change);

      setLoading(true);
      const response = await apiService.updateCartItem(productId, newQuantity);
      setCartItems(response.data.items || []);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Failed to update quantity');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      setLoading(true);
      const response = await apiService.removeFromCart(productId);
      setCartItems(response.data.items || []);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Failed to remove item');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
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
        <div className="loading-container">
          <i className="fas fa-spinner fa-spin loading-spinner"></i>
          <h2>Loading your cart...</h2>
          <p>Please wait while we fetch your items</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-container">
        <div className="error-container">
          <h1 className="cart-title">Error</h1>
          <p className="error-message">{error}</p>
          <div className="error-actions">
            <button className="continue-shopping" onClick={fetchCart}>Try Again</button>
            <button className="dismiss-error" onClick={clearError}>Dismiss</button>
          </div>
        </div>
      </div>
    );
  }

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Simulate checkout process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real application, you would make an API call to create an order
      // const response = await fetch('https://phonomania-store.onrender.com/api/orders', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify({
      //     items: cartItems,
      //     shippingAddress: user.address,
      //     paymentMethod: 'credit_card',
      //     totalAmount: total
      //   })
      // });
      
      setCheckoutSuccess(true);
      setCartItems([]);
      
      // Redirect to success page after a delay
      setTimeout(() => {
        navigate('/checkout-success');
      }, 2000);
      
    } catch (error) {
      setError('Checkout failed. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Function to clear error message is defined at the top of the component

  if (checkoutSuccess) {
    return (
      <div className="cart-container">
        <div className="checkout-success">
          <i className="fas fa-check-circle success-icon"></i>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your purchase. Redirecting to confirmation page...</p>
        </div>
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
                    <img 
                      src={item.product.images && item.product.images.length > 0 ? item.product.images[0].url : 'https://placehold.co/300x300?text=No+Image'} 
                      alt={item.product.name} 
                      className="item-image" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/300x300?text=No+Image';
                      }}
                    />
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
            <button 
              className="checkout-btn" 
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-lock"></i> Secure Checkout
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add some products to your cart to see them here!</p>
          <button className="continue-shopping" onClick={() => navigate('/products')}>Continue Shopping</button>
        </div>
      )}
    </div>
  );
};

export default Cart;
