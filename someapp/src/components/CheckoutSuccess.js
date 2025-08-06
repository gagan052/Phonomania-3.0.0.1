import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const CheckoutSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="checkout-success-container">
      <div className="checkout-success-card">
        <div className="success-icon-container">
          <i className="fas fa-check-circle success-icon"></i>
        </div>
        <h1>Order Placed Successfully!</h1>
        <p className="success-message">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        <div className="order-details">
          <h3>Order Details</h3>
          <p>Order confirmation has been sent to your email.</p>
          <p>You will receive shipping updates soon.</p>
        </div>
        <div className="success-actions">
          <button 
            className="continue-shopping-btn" 
            onClick={() => navigate('/products')}
          >
            <i className="fas fa-shopping-bag"></i> Continue Shopping
          </button>
          <button 
            className="view-orders-btn" 
            onClick={() => navigate('/profile')}
          >
            <i className="fas fa-list-alt"></i> View My Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;