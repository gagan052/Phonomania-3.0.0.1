import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import './Home.css';
import axios from "axios";

import apiService from './utils/new-request';
const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userListings, setUserListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Fetch user listings for the featured section
    fetchUserListings();
  }, []);
  
  const fetchUserListings = async () => {
    try {
      setLoadingListings(true);
      const response = await apiService.getUserListings();
      
      // Get up to 4 user listings to display
      setUserListings(response.data.slice(0, 4));
    } catch (error) {
      console.error('Error fetching user listings:', error);
    } finally {
      setLoadingListings(false);
    }
  };

  const API_URL = process.env.REACT_APP_API_URL;

const addToCart = async (productId) => {
  try {
    const res = await fetch(`${API_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ productId, price: 0 }), // Setting default price to 0
    });

    if (!res.ok) {
      throw new Error("Failed to add to cart");
    }

    const data = await res.json();
    console.log("Added to cart:", data);
  } catch (err) {
    console.error("Error adding to cart:", err);
  }
};


  // const handleAddToCart = async (productId, quantity, price = null, isUserListing = false) => {

    const handleAddToCart = async (productId) => {
  const token = localStorage.getItem("token"); // Make sure token exists

  if (!token) {
    alert("You must be logged in to add items to cart!");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Must include 'Bearer '
      },
      body: JSON.stringify({ productId, price: 0 }), // Setting default price to 0
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to add to cart");
    }

    const data = await res.json();
    console.log("Added to cart:", data);
    alert("Product added to cart successfully!");
  } catch (error) {
    console.error("Error adding to cart:", error);
    alert(`Failed to add to cart: ${error.message}`);
  }
};

  //   if (!user) {
  //     navigate('/login');
  //     return;
  //   }

  //   try {
  //     const token = localStorage.getItem('token');
  //     if (!token) {
  //       navigate('/login');
  //       return;
  //     }

  //     // Show loading indicator
  //     const productElement = document.getElementById(`add-to-cart-${productId}`);
  //     if (productElement) {
  //       productElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
  //       productElement.disabled = true;
  //     }
      
  //     // If it's a user listing, use the provided price, otherwise use the hardcoded price
  //     const productPrice = isUserListing ? price : getProductPrice(productId);
      
  //     const response = await apiService.addToCart(productId, quantity, productPrice);
      
  //     // Helper function to get product price based on ID
  //     function getProductPrice(id) {
  //       const prices = {
  //         'iphone14promax': 1099.99,
  //         's23ultra': 1199.99,
  //         'p30pro': 699.99,
  //         'iphone14progold': 1099.99
  //       };
  //       return prices[id] || 999.99; // Default price if not found
  //     }

  //     // Reset button state
  //     if (productElement) {
  //       productElement.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
  //       productElement.disabled = false;
  //     }
      
  //     if (response.status === 200 || response.status === 201) {
  //       // Trigger cart update event to refresh cart count in navbar
  //       window.dispatchEvent(new CustomEvent('authStateChange'));
        
  //       // Show success message in a non-blocking way
  //       const successMessage = document.createElement('div');
  //       successMessage.className = 'alert alert-success position-fixed bottom-0 end-0 m-3';
  //       successMessage.innerHTML = '<i class="fas fa-check-circle me-2"></i>Added to cart successfully!';
  //       document.body.appendChild(successMessage);
        
  //       // Remove the message after 3 seconds
  //       setTimeout(() => {
  //         successMessage.remove();
  //       }, 3000);
  //     } else {
  //       // Show error message
  //       const errorMessage = document.createElement('div');
  //       errorMessage.className = 'alert alert-danger position-fixed bottom-0 end-0 m-3';
  //       errorMessage.innerHTML = `<i class="fas fa-exclamation-circle me-2"></i>${response.data?.message || 'Failed to add product to cart'}`;
  //       document.body.appendChild(errorMessage);
        
  //       // Remove the message after 3 seconds
  //       setTimeout(() => {
  //         errorMessage.remove();
  //       }, 3000);
  //     }
  //   } catch (error) {
  //     console.error('Error adding to cart:', error);
      
  //     // Reset button state if there was an error
  //     const productElement = document.getElementById(`add-to-cart-${productId}`);
  //     if (productElement) {
  //       productElement.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
  //       productElement.disabled = false;
  //     }
      
  //     // Show error message
  //     const errorMessage = document.createElement('div');
  //     errorMessage.className = 'alert alert-danger position-fixed bottom-0 end-0 m-3';
  //     let errorText = 'Failed to add product to cart';
      
  //     if (error.response && error.response.data) {
  //       errorText = error.response.data.message || errorText;
  //     } else if (error.message) {
  //       errorText = error.message;
  //     } else {
  //       errorText = 'Network error. Please check your connection.';
  //     }
      
  //     errorMessage.innerHTML = `<i class="fas fa-exclamation-circle me-2"></i>${errorText}`;
  //     document.body.appendChild(errorMessage);
      
  //     // Remove the message after 3 seconds
  //     setTimeout(() => {
  //       errorMessage.remove();
  //     }, 3000);
  //   }
  // };
     return(
        <>
        <section id="header">
        <div className="container-fluid nav_bg">
          <div className="row">
              <div className="col-10 mx-auto">
                <div className="row align-items-center">

                <div className="col-md-6 pt-5 order-2 order-lg-1">
                 <h1 className="hero-heading">BEYOND YOUR IMAGINATION <br/><strong className="brand">PHONO MANIA</strong></h1> 
                 <h4 className="hero-subheading">Find the perfect smartphone at the perfect price</h4>
                 <div className="mt-4 d-flex gap-3">
                     <a href="#products" className="hero-btn">Explore Phones</a>
                     <a href="/sell-device" className="hero-btn btn-amazon-secondary">Sell Your Device</a>
                 </div> 
               </div>

               <div className="animated col-lg-6 order-1 order-lg-2 mt-5">
                  <img src="https://img.mobygeek.com/crop/1200x628/2020/10/14/1280x720-dddf.jpg" className="hero-image img-fluid" alt="Smartphone Collection"/>   
                </div>  
                </div>
              </div>
          </div>
      </div>
        </section>
        <br></br>
        <br></br>
        <div className="container">
        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={0} className="active" aria-current="true" aria-label="Slide 1" />
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={1} aria-label="Slide 2" />
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={2} aria-label="Slide 3" />
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="https://browserstack.wpenginepowered.com/wp-content/uploads/2022/10/Testing-on-real-mobile-devices.png" className="d-block w-100" alt="Mobile devices collection" />
              <div className="carousel-caption d-none d-md-block">
                <h3>Premium Quality Devices</h3>
                <p>Explore our collection of certified used smartphones</p>
              </div>
            </div>
            <div className="carousel-item">
              <img src="https://placehold.co/1200x400?text=Latest+Smartphone+Models" className="d-block w-100" alt="Latest smartphone models" />
              <div className="carousel-caption d-none d-md-block">
                <h3>Latest Models Available</h3>
                <p>Get the newest technology at affordable prices</p>
              </div>
            </div>
            <div className="carousel-item">
              <img src="https://placehold.co/1200x400?text=Smartphone+Applications" className="d-block w-100" alt="Smartphone applications" />
              <div className="carousel-caption d-none d-md-block">
                <h3>Fully Tested & Verified</h3>
                <p>All our devices undergo rigorous quality checks</p>
              </div>
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      <br></br>
      <br></br>
      {/* User Listings Section */}
      <section className="user-listings-section py-5 bg-light">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-title">Community Listings</h2>
            <a href="/user-listings" className="btn btn-amazon">
              <i className="fas fa-list me-2"></i>View All Listings
            </a>
          </div>
          
          {loadingListings ? (
            <div className="text-center mb-4">
              <i className="fas fa-spinner fa-spin me-2"></i> Loading user listings...
            </div>
          ) : userListings.length > 0 ? (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
              {userListings.map(listing => (
                <div className="col" key={listing._id}>
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
                      <div className="d-flex align-items-center mb-1">
                        <div className="text-warning me-1">
                          {[...Array(5)].map((_, i) => (
                            <i 
                              key={i} 
                              className={`fas fa-star ${i < Math.floor(listing.ratings || 4) ? '' : 'text-muted'}`}
                            ></i>
                          ))}
                        </div>
                        <small className="text-muted">({listing.numOfReviews || 0})</small>
                      </div>
                      <h5 className="card-title">{listing.name}</h5>
                      <div className="price mb-2">${listing.price?.toFixed(2) || '999.99'}</div>
                      <div className="text-success small mb-2">
                        <i className="fas fa-check-circle me-1"></i> {listing.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </div>
                      <p className="card-text small text-muted">
                        {listing.description?.substring(0, 60)}{listing.description?.length > 60 ? '...' : ''}
                      </p>
                      <div className="d-grid gap-2">
                        <button 
                          id={`add-to-cart-${listing._id}`}
                          className="btn btn-amazon" 
                          onClick={() => handleAddToCart(listing._id, 1, listing.price, true)}
                          disabled={listing.stock <= 0}
                        >
                          <i className="fas fa-shopping-cart me-1"></i> Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p>No community listings available yet.</p>
              <a href="/sell-device" className="btn btn-amazon mt-2">
                <i className="fas fa-tag me-2"></i>Be the first to sell
              </a>
            </div>
          )}
        </div>
      </section>
      
      <br></br>
      <br></br>
      <section id="products" className="product-section">
        <div className="container">
          <h2 className="section-title mb-4">Featured Smartphones</h2>
          {loadingListings && (
            <div className="text-center mb-4">
              <i className="fas fa-spinner fa-spin me-2"></i> Loading user listings...
            </div>
          )}
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            <div className="col">
              <div className="card" data-aos="zoom-in">
                <div className="card-badge">Best Seller</div>
                <img src="https://cdn.shopify.com/s/files/1/0568/5942/7015/products/MQ9P3HN_A_1.jpg?v=1662718624" className="card-img-top" alt="iPhone 14 Pro Max" />
                <div className="card-body">
                  <div className="d-flex align-items-center mb-1">
                    <div className="text-warning me-1">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star-half-alt"></i>
                    </div>
                    <small className="text-muted">(42)</small>
                  </div>
                  <h5 className="card-title">iPhone 14 Pro Max</h5>
                  <div className="price mb-2">₹1,20,999</div>
                  <div className="text-success small mb-2">
                    <i className="fas fa-check-circle me-1"></i> In Stock
                  </div>
                  <p className="card-text small text-muted">Special Edition Only Available On Phonomania</p>
                  <div className="d-grid gap-2">
                    <button 
                      id="add-to-cart-iphone14promax"
                      className="btn btn-amazon" 
                      onClick={() => handleAddToCart('iphone14promax', 1)}
                    >
                      <i className="fas fa-shopping-cart me-1"></i> Add to Cart
                    </button>
                    <button className="btn btn-amazon-secondary">
                      <i className="fas fa-bolt me-1"></i> Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card" data-aos="zoom-in">
                <div className="card-badge">New</div>
                <img src="https://cdn1.smartprix.com/rx-izLSMVlI0-w1200-h1200/zLSMVlI0.jpg" className="card-img-top" alt="Samsung S23 Ultra" />
                <div className="card-body">
                  <div className="d-flex align-items-center mb-1">
                    <div className="text-warning me-1">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                    <small className="text-muted">(36)</small>
                  </div>
                  <h5 className="card-title">Samsung S23 Ultra</h5>
                  <div className="price mb-2">₹1,27,999</div>
                  <div className="text-success small mb-2">
                    <i className="fas fa-check-circle me-1"></i> In Stock
                  </div>
                  <p className="card-text small text-muted">Special Edition Only Available On Phonomania</p>
                  <div className="d-grid gap-2">
                    <button 
                      id="add-to-cart-s23ultra"
                      className="btn btn-amazon" 
                      onClick={() => handleAddToCart('s23ultra', 1)}
                    >
                      <i className="fas fa-shopping-cart me-1"></i> Add to Cart
                    </button>
                    <button className="btn btn-amazon-secondary">
                      <i className="fas fa-bolt me-1"></i> Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card" data-aos="fade-right">
                <img src="https://images-cdn.ubuy.co.in/6340051ae566b8277211a103-huawei-p30-pro-128gb-8gb-ram-vog-l29.jpg" className="card-img-top" alt="Huawei P30 Pro" />
                <div className="card-body">
                  <div className="d-flex align-items-center mb-1">
                    <div className="text-warning me-1">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="far fa-star"></i>
                    </div>
                    <small className="text-muted">(28)</small>
                  </div>
                  <h5 className="card-title">Huawei P30 Pro</h5>
                  <div className="price mb-2">₹79,000</div>
                  <div className="text-success small mb-2">
                    <i className="fas fa-check-circle me-1"></i> In Stock
                  </div>
                  <p className="card-text small text-muted">Special Edition Only Available On Phonomania</p>
                  <div className="d-grid gap-2">
                    <button 
                      id="add-to-cart-p30pro"
                      className="btn btn-amazon" 
                      onClick={() => handleAddToCart('p30pro', 1)}
                    >
                      <i className="fas fa-shopping-cart me-1"></i> Add to Cart
                    </button>
                    <button className="btn btn-amazon-secondary">
                      <i className="fas fa-bolt me-1"></i> Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card" data-aos="fade-left">
                <div className="card-badge">Limited</div>
                <img src="https://placehold.co/300x300?text=iPhone+14+Pro+Gold+Edition" className="card-img-top" alt="iPhone 14 Pro Gold Edition" />
                <div className="card-body">
                  <div className="d-flex align-items-center mb-1">
                    <div className="text-warning me-1">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                    <small className="text-muted">(12)</small>
                  </div>
                  <h5 className="card-title">iPhone 14 Pro Gold Edition</h5>
                  <div className="price mb-2">₹10,15,79,000</div>
                  <div className="text-warning small mb-2">
                    <i className="fas fa-exclamation-circle me-1"></i> Only 2 left in stock
                  </div>
                  <p className="card-text small text-muted">Special Edition Only Available On Phonomania</p>
                  <div className="d-grid gap-2">
                    <button 
                      id="add-to-cart-iphone14progold"
                      className="btn btn-amazon" 
                      onClick={() => handleAddToCart('iphone14progold', 1)}
                    >
                      <i className="fas fa-shopping-cart me-1"></i> Add to Cart
                    </button>
                    <button className="btn btn-amazon-secondary">
                      <i className="fas fa-bolt me-1"></i> Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Display user listings */}
            {userListings.map(listing => (
              <div className="col" key={listing._id}>
                <div className="card" data-aos="zoom-in">
                  <div className="card-badge bg-info">User Listed</div>
                  {listing.images && listing.images.length > 0 ? (
                    <img src={listing.images[0].url} className="card-img-top" alt={listing.name} />
                  ) : (
                    <img src="https://placehold.co/300x300?text=No+Image" className="card-img-top" alt="Product placeholder" />
                  )}
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-1">
                      <div className="text-warning me-1">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="far fa-star"></i>
                      </div>
                      <small className="text-muted">(New)</small>
                    </div>
                    <h5 className="card-title">{listing.name}</h5>
                    <div className="price mb-2">₹{listing.price.toLocaleString()}</div>
                    <div className="text-success small mb-2">
                      <i className="fas fa-check-circle me-1"></i> {listing.condition} - {listing.stock} in Stock
                    </div>
                    <p className="card-text small text-muted">
                      {listing.description ? (listing.description.substring(0, 60) + (listing.description.length > 60 ? '...' : '')) : 'No description available'}
                    </p>
                    <div className="d-grid gap-2">
                      <button 
                        id={`add-to-cart-${listing._id}`}
                        className="btn btn-amazon" 
                        onClick={() => handleAddToCart(listing._id, 1, listing.price, true)}
                      >
                        <i className="fas fa-shopping-cart me-1"></i> Add to Cart
                      </button>
                      <button className="btn btn-amazon-secondary">
                        <i className="fas fa-bolt me-1"></i> Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div style={{backgroundColor:"grey"}}>
      <footer className="footer-section">
        <div className="container">
          <div className="footer-cta pt-5 pb-5">
            <div className="row">
              <div className="col-xl-4 col-md-4 mb-30">
                <div className="single-cta">
                  <i className="fas fa-map-marker-alt" />
                  <div className="cta-text">
                    <h4>Find us</h4>
                    <span>Ambala city, Haryana</span>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-md-4 mb-30">
                <div className="single-cta">
                  <i className="fas fa-phone" />
                  <div className="cta-text">
                    <h4>Call us</h4>
                    <span>9728422008</span>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-md-4 mb-30">
                <div className="single-cta">
                  <i className="far fa-envelope-open" />
                  <div className="cta-text">
                    <h4>Mail us</h4>
                    <span>gagansaini7207@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-content pt-5 pb-5">
            <div className="row">
              <div className="col-xl-4 col-lg-4 mb-50">
                <div className="footer-widget">
                  <div className="footer-logo">
                    <a href="index.html"><img src="https://img.freepik.com/premium-vector/pm-logo-design_737672-274.jpg" className="img-fluid" alt="logo" /></a>
                  </div>
                  <div className="footer-text">
                    <p>We have been in the business for quite a while now, and in that time we have not only managed to make close relationships with numerous partners, but also to recognize what people need. At MobileShop you will find quality products from top brands at consistently low prices. We are offering a wide range of smartphones.</p>
                  </div>
                  <div className="footer-social-icon">
                    <span>Follow us</span>
                    <button onClick={() => window.open('https://facebook.com', '_blank')} className="btn p-0 border-0 bg-transparent"><img src="https://img.icons8.com/fluency/2x/facebook-new.png" className="fab fa-facebook-f facebook-bg" alt="Facebook" /></button>
                    <button onClick={() => window.open('https://whatsapp.com', '_blank')} className="btn p-0 border-0 bg-transparent"><img src="https://img.icons8.com/color/2x/whatsapp.png" className="fab fa-twitter twitter-bg" alt="WhatsApp" /></button>
                    <button onClick={() => window.open('https://google.com', '_blank')} className="btn p-0 border-0 bg-transparent"><img src="https://img.icons8.com/fluency/2x/google-logo.png" className="fab fa-google-plus-g google-bg" alt="Google" /></button>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 mb-30">
                <div className="footer-widget">
                  <div className="footer-widget-heading">
                    <h3>Useful Links</h3>
                  </div>
                  <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/services">Services</a></li>
                    <li><a href="/portfolio">Portfolio</a></li>
                    <li><a href="/contact">Contact</a></li>
                    <li><a href="/about-us">About us</a></li>
                    <li><a href="/services">Our Services</a></li>
                    <li><a href="/team">Expert Team</a></li>
                    <li><a href="/contact">Contact us</a></li>
                    <li><a href="/news">Latest News</a></li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 mb-50">
                <div className="footer-widget">
                  <div className="footer-widget-heading">
                    <h3>Subscribe</h3>
                  </div>
                  <div className="footer-text mb-25">
                    <p>Don’t miss to subscribe to our new feeds, kindly fill the form below.</p>
                  </div>
                  <div className="subscribe-form">
                    <form action="#">
                      <input type="text" placeholder="Email Address" />
                      <button><i className="fab fa-telegram-plane" /></button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        <div className="copyright-area">
          <div className="container">
            <div className="row">
              <div className="col-xl-6 col-lg-6 text-center text-lg-left">
                <div className="copyright-text">
                <div className="text-center">Copyright © 2023, All Right Reserved <a href="https://github.com/gagan052/Phonomania-2.0.0.1">Rishu</a></div>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 d-none d-lg-block text-right">
                <div className="footer-menu">
                
                   
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      </div>
      </>
   );
};

export default Home;
