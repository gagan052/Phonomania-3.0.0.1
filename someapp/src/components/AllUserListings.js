import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../Home.css';
import '../amazon-theme.css';
import './AllUserListings.css';
import { Modal, Button } from 'react-bootstrap';

const AllUserListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [sortOption, setSortOption] = useState('newest');
  const [filterCondition, setFilterCondition] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchAllListings = useCallback(async () => {
    try {
      setLoading(true);
      // Use the dedicated endpoint for user listings
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products?category=Used`);

      if (!response.ok) {
        throw new Error('Failed to fetch user listings');
      }
      
      // The API now returns only user listings, no need to filter
      const data = await response.json();
      let userListings = data;
      
      // Apply condition filter if not 'all'
      if (filterCondition !== 'all') {
        userListings = userListings.filter(product => 
          product.condition && product.condition.toLowerCase() === filterCondition.toLowerCase()
        );
      }
      
      // Apply sorting
      if (sortOption === 'price-low-high') {
        userListings.sort((a, b) => a.price - b.price);
      } else if (sortOption === 'price-high-low') {
        userListings.sort((a, b) => b.price - a.price);
      } else if (sortOption === 'newest') {
        userListings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      
      setListings(userListings);
    } catch (error) {
      console.error('Error fetching user listings:', error);
      setError('Failed to load listings. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [sortOption, filterCondition]);

  useEffect(() => {
    fetchAllListings();
  }, [sortOption, filterCondition, fetchAllListings]);

  const handleAddToCart = async (productId, price) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      // Show loading indicator
      const productElement = document.getElementById(`add-to-cart-${productId}`);
      if (productElement) {
        productElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
        productElement.disabled = true;
      }
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity: 1, price })
      });
      
      // Reset button state
      if (productElement) {
        productElement.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
        productElement.disabled = false;
      }
      
      if (response.ok) {
        // Trigger cart update event to refresh cart count in navbar
        window.dispatchEvent(new CustomEvent('authStateChange'));
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'alert alert-success position-fixed bottom-0 end-0 m-3';
        successMessage.innerHTML = '<i class="fas fa-check-circle me-2"></i>Added to cart successfully!';
        document.body.appendChild(successMessage);
        
        setTimeout(() => {
          document.body.removeChild(successMessage);
        }, 3000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="loading-container text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading user listings...</p>
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
          <button className="btn btn-amazon" onClick={fetchAllListings}>Try Again</button>
        </div>
      </div>
    );
  }

  // Get current listings for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentListings = listings.slice(indexOfFirstItem, indexOfLastItem);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Handle opening the modal with product details
  const openProductModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };
  
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1>User Listings</h1>
              <p className="text-muted">Browse devices uploaded by our community members</p>
            </div>
            <Link to="/sell-device" className="btn btn-amazon">
              <i className="fas fa-tag me-2"></i>Sell Your Device
            </Link>
          </div>
          
          {/* Filtering and Sorting Options */}
          <div className="row mb-4">
            <div className="col-md-6 col-lg-3 mb-3">
              <label htmlFor="sortOptions" className="form-label">Sort By</label>
              <select 
                className="form-select" 
                id="sortOptions"
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  setCurrentPage(1); // Reset to first page when sorting changes
                }}
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
            <div className="col-md-6 col-lg-3 mb-3">
              <label htmlFor="conditionFilter" className="form-label">Filter by Condition</label>
              <select 
                className="form-select" 
                id="conditionFilter"
                value={filterCondition}
                onChange={(e) => {
                  setFilterCondition(e.target.value);
                  setCurrentPage(1); // Reset to first page when filter changes
                }}
              >
                <option value="all">All Conditions</option>
                <option value="new">New</option>
                <option value="like new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </div>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-box-open fa-3x mb-3 text-muted"></i>
              <h3>No user listings available</h3>
              <p className="text-muted mb-4">There are currently no devices listed by users. Be the first to sell your device!</p>
              <Link to="/sell-device" className="btn btn-amazon">
                <i className="fas fa-tag me-2"></i>Sell a Device
              </Link>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
              {currentListings.map((listing) => (
                <div className="col" key={listing._id}>
                  <div className="card h-100 product-card">
                    <div className="card-img-container" onClick={() => openProductModal(listing)} style={{ cursor: 'pointer' }}>
                      <img 
                        src={listing.images && listing.images.length > 0 ? listing.images[0].url : 'https://placehold.co/300x300?text=No+Image'} 
                        className="card-img-top" 
                        alt={listing.name} 
                        style={{ height: '200px', objectFit: 'contain' }}
                      />
                      {listing.seller?.isPrime && (
                        <span className="badge bg-warning position-absolute top-0 end-0 m-2">
                          <i className="fas fa-crown me-1"></i>Prime Seller
                        </span>
                      )}
                    </div>
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title product-title" onClick={() => openProductModal(listing)} style={{ cursor: 'pointer' }}>{listing.name}</h5>
                      <div className="product-rating mb-2">
                        <span className="stars">
                          {[...Array(5)].map((_, i) => (
                            <i 
                              key={i} 
                              className={`fas fa-star ${i < Math.floor(listing.ratings || 4) ? 'text-warning' : 'text-muted'}`}
                            ></i>
                          ))}
                        </span>
                        <span className="rating-count ms-2 text-muted">({listing.numOfReviews || 0})</span>
                      </div>
                      <p className="card-text product-price mb-1">
                        <span className="currency">$</span>
                        <span className="amount">{listing.price?.toFixed(2) || '999.99'}</span>
                      </p>
                      <p className="card-text small text-muted mb-2">
                        {listing.description?.substring(0, 80)}{listing.description?.length > 80 ? '...' : ''}
                      </p>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge bg-info me-2">{listing.condition || 'New'}</span>
                        <span className="badge bg-secondary">{listing.category || 'Other'}</span>
                      </div>
                      {listing.stock > 0 ? (
                        <p className="text-success mb-2"><i className="fas fa-check-circle me-1"></i> In Stock</p>
                      ) : (
                        <p className="text-danger mb-2"><i className="fas fa-times-circle me-1"></i> Out of Stock</p>
                      )}
                      <div className="mt-auto">
                        <button 
                          id={`add-to-cart-${listing._id}`}
                          className="btn btn-primary w-100" 
                          onClick={() => handleAddToCart(listing._id, listing.price)}
                          disabled={listing.stock <= 0}
                        >
                          <i className="fas fa-shopping-cart me-2"></i>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {listings.length > 0 && (
            <nav className="mt-4" aria-label="Product pagination">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                    <i className="fas fa-chevron-left"></i>
                  </button>
                </li>
                {Array.from({ length: Math.ceil(listings.length / itemsPerPage) }).map((_, index) => (
                  <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => paginate(index + 1)}>
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === Math.ceil(listings.length / itemsPerPage) ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
      
      {/* Product Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        {selectedProduct && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedProduct.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div id="productImageCarousel" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                      {selectedProduct.images && selectedProduct.images.length > 0 ? (
                        selectedProduct.images.map((image, index) => (
                          <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                            <img src={image.url} className="d-block w-100" alt={`${selectedProduct.name} - ${index}`} />
                          </div>
                        ))
                      ) : (
                        <div className="carousel-item active">
                          <img src="https://placehold.co/500x500?text=No+Image" className="d-block w-100" alt="Product placeholder" />
                        </div>
                      )}
                    </div>
                    {selectedProduct.images && selectedProduct.images.length > 1 && (
                      <>
                        <button className="carousel-control-prev" type="button" data-bs-target="#productImageCarousel" data-bs-slide="prev">
                          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                          <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#productImageCarousel" data-bs-slide="next">
                          <span className="carousel-control-next-icon" aria-hidden="true"></span>
                          <span className="visually-hidden">Next</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h3 className="mb-0">${selectedProduct.price?.toFixed(2) || '999.99'}</h3>
                    <span className="badge bg-info">{selectedProduct.condition || 'New'}</span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="product-rating">
                      <span className="stars">
                        {[...Array(5)].map((_, i) => (
                          <i 
                            key={i} 
                            className={`fas fa-star ${i < Math.floor(selectedProduct.ratings || 4) ? 'text-warning' : 'text-muted'}`}
                          ></i>
                        ))}
                      </span>
                      <span className="rating-count ms-2 text-muted">({selectedProduct.numOfReviews || 0} reviews)</span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h5>Description</h5>
                    <p>{selectedProduct.description || 'No description available.'}</p>
                  </div>
                  
                  <div className="mb-3">
                    <h5>Specifications</h5>
                    <ul className="list-group list-group-flush">
                      {selectedProduct.brand && <li className="list-group-item"><strong>Brand:</strong> {selectedProduct.brand}</li>}
                      {selectedProduct.category && <li className="list-group-item"><strong>Category:</strong> {selectedProduct.category}</li>}
                      {selectedProduct.model && <li className="list-group-item"><strong>Model:</strong> {selectedProduct.model}</li>}
                      {selectedProduct.storage && <li className="list-group-item"><strong>Storage:</strong> {selectedProduct.storage}</li>}
                      {selectedProduct.color && <li className="list-group-item"><strong>Color:</strong> {selectedProduct.color}</li>}
                    </ul>
                  </div>
                  
                  <div className="d-grid gap-2">
                    <Button 
                      variant="primary" 
                      onClick={() => handleAddToCart(selectedProduct._id, selectedProduct.price)}
                      disabled={selectedProduct.stock <= 0}
                      className="btn-amazon"
                    >
                      <i className="fas fa-shopping-cart me-2"></i>
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
};

export default AllUserListings;