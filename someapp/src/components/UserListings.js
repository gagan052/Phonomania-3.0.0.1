import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const UserListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchListings = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/listings/my-listings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }

      const data = await response.json();
      setListings(data);
    } catch (error) {
      console.error('Error fetching listings:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to load listings. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${process.env.API_BASE_URL}/listings/${listingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete listing');
      }

      // Remove the deleted listing from state
      setListings(listings.filter(listing => listing._id !== listingId));

      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'alert alert-success position-fixed bottom-0 end-0 m-3';
      successMessage.innerHTML = '<i class="fas fa-check-circle me-2"></i>Listing deleted successfully!';
      document.body.appendChild(successMessage);
      
      // Remove the message after 3 seconds
      setTimeout(() => {
        successMessage.remove();
      }, 3000);

    } catch (error) {
      // Show error message
      const errorMessage = document.createElement('div');
      errorMessage.className = 'alert alert-danger position-fixed bottom-0 end-0 m-3';
      errorMessage.innerHTML = `<i class="fas fa-exclamation-circle me-2"></i>${error.message || 'Failed to delete listing'}`;
      document.body.appendChild(errorMessage);
      
      // Remove the message after 3 seconds
      setTimeout(() => {
        errorMessage.remove();
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="loading-container">
          <i className="fas fa-spinner fa-spin loading-spinner"></i>
          <h2>Loading your listings...</h2>
          <p>Please wait while we fetch your device listings</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="error-container">
          <h1>Error</h1>
          <p className="error-message">{error}</p>
          <button className="btn btn-amazon" onClick={fetchListings}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>My Device Listings</h1>
            <button 
              className="btn btn-amazon" 
              onClick={() => navigate('/sell-device')}
            >
              <i className="fas fa-plus me-2"></i>Add New Listing
            </button>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-box-open fa-3x mb-3 text-muted"></i>
              <h3>You don't have any listings yet</h3>
              <p className="text-muted mb-4">Start selling your devices by creating your first listing</p>
              <button 
                className="btn btn-amazon" 
                onClick={() => navigate('/sell-device')}
              >
                <i className="fas fa-tag me-2"></i>Sell a Device
              </button>
            </div>
          ) : (
            <div className="row">
              {listings.map(listing => (
                <div className="col-md-6 col-lg-4 mb-4" key={listing._id}>
                  <div className="card h-100">
                    {listing.images && listing.images.length > 0 ? (
                      <img 
                        src={listing.images[0].url} 
                        className="card-img-top" 
                        alt={listing.name} 
                        style={{ height: '200px', objectFit: 'contain' }}
                      />
                    ) : (
                      <img 
                        src="https://placehold.co/300x300?text=No+Image" 
                        className="card-img-top" 
                        alt="Product placeholder"
                        style={{ height: '200px', objectFit: 'contain' }}
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{listing.name}</h5>
                      <div className="price mb-2">${listing.price.toFixed(2)}</div>
                      <div className="mb-2">
                        <span className="badge bg-info me-2">{listing.condition}</span>
                        <span className="badge bg-secondary">{listing.category}</span>
                      </div>
                      <p className="card-text small text-muted">
                        {listing.description.substring(0, 100)}{listing.description.length > 100 ? '...' : ''}
                      </p>
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <small className="text-muted">Stock: {listing.stock}</small>
                        <div>
                          <button 
                            className="btn btn-sm btn-outline-danger me-2"
                            onClick={() => handleDeleteListing(listing._id)}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => navigate(`/edit-listing/${listing._id}`)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserListings;