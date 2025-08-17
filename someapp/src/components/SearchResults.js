import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../Home.css';

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  
  // Get search query from URL parameters
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'All';

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        
        // Build the API URL with search parameters
        const API_URL = process.env.REACT_APP_API_URL;
        let apiUrl = `${API_URL}/products`;
        
        // If we have a search query, add it to the request
        if (query) {
          apiUrl += `?search=${encodeURIComponent(query)}`;
          
          // If category is specified and not 'All', add it to the request
          if (category && category !== 'All') {
            apiUrl += `&category=${encodeURIComponent(category)}`;
          }
        }
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setError('Failed to load search results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, category]);

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
      
      const API_URL = process.env.REACT_APP_API_URL;
      const response = await fetch(`${API_URL}/cart`, {
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

  return (
    <div className="container my-4">
      <div className="search-results-header mb-4">
        <h2>Search Results for "{query}"</h2>
        {category !== 'All' && <p>Category: {category}</p>}
      </div>
      
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Searching for products...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : products.length === 0 ? (
        <div className="no-results text-center my-5">
          <i className="fas fa-search fa-3x mb-3 text-muted"></i>
          <h3>No products found</h3>
          <p>We couldn't find any products matching your search criteria.</p>
          <Link to="/" className="btn btn-primary mt-3">
            <i className="fas fa-home me-2"></i>Back to Home
          </Link>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {products.map((product) => (
            <div className="col" key={product._id}>
              <div className="card h-100 product-card">
                <div className="card-img-container">
                  <img 
                    src={product.images && product.images.length > 0 ? product.images[0].url : 'https://placehold.co/300x300?text=No+Image'} 
                    className="card-img-top" 
                    alt={product.name} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/300x300?text=No+Image';
                    }}
                  />
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title product-title">{product.name}</h5>
                  <div className="product-rating mb-2">
                    <span className="stars">
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i} 
                          className={`fas fa-star ${i < Math.floor(product.ratings || 4) ? 'text-warning' : 'text-muted'}`}
                        ></i>
                      ))}
                    </span>
                    <span className="rating-count ms-2 text-muted">({product.numOfReviews || 0})</span>
                  </div>
                  <p className="card-text product-price mb-1">
                    <span className="currency">$</span>
                    <span className="amount">{product.price?.toFixed(2) || '999.99'}</span>
                  </p>
                  {product.stock > 0 ? (
                    <p className="text-success mb-3"><i className="fas fa-check-circle me-1"></i> In Stock</p>
                  ) : (
                    <p className="text-danger mb-3"><i className="fas fa-times-circle me-1"></i> Out of Stock</p>
                  )}
                  <div className="mt-auto">
                    <button 
                      id={`add-to-cart-${product._id}`}
                      className="btn btn-primary w-100" 
                      onClick={() => handleAddToCart(product._id, product.price)}
                      disabled={product.stock <= 0}
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
    </div>
  );
};

export default SearchResults;