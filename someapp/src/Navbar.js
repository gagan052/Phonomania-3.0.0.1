import React, { useState, useEffect, useRef } from "react";
import './index.css';
import './Home.css';
import './Navbar.css';
import './amazon-theme.css';
import { NavLink } from "react-router-dom";
import apiService from "./utils/new-request";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchCartCount();
    }

    // Listen for auth state changes
    const handleAuthChange = () => {
      const updatedUser = localStorage.getItem('user');
      if (updatedUser) {
        setUser(JSON.parse(updatedUser));
        fetchCartCount();
      } else {
        setUser(null);
        setCartCount(0);
      }
    };

    // Handle clicking outside of dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // Add event listeners
    window.addEventListener('authStateChange', handleAuthChange);
    document.addEventListener('click', handleClickOutside);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('authStateChange', handleAuthChange);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await apiService.getCart();
      setCartCount(response.data.items.length);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCartCount(0);
    window.location.href = '/';
  };

  return(
        <>
        <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
          <div className="container-fluid px-2 px-md-3">
            <div className="d-flex align-items-center">
              <img src="https://thumbs.dreamstime.com/b/vector-graphic-emblem-hexagon-initials-letter-pm-logo-design-template-vector-graphic-initials-letter-pm-logo-design-template-204622998.jpg" height="40px" className="me-2" alt="PhoneMania Logo"/>
              <NavLink className="navbar-brand fw-bold text-white" to="/">PHONOMANIA</NavLink>
            </div>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <form className="d-flex mx-auto search-form" onSubmit={(e) => {
                e.preventDefault();
                const searchInput = e.target.querySelector('input[type="search"]');
                const categorySelect = e.target.querySelector('select');
                const searchQuery = searchInput.value.trim();
                const category = categorySelect.value;
                
                if (searchQuery) {
                  window.location.href = `/search?q=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(category)}`;
                }
              }}>
                <div className="input-group">
                  <select className="form-select" style={{maxWidth: '120px', borderRadius: '4px 0 0 4px', backgroundColor: '#f3f3f3'}}>
                    <option>All</option>
                    <option>Smartphones</option>
                    <option>Accessories</option>
                    <option>Used</option>
                  </select>
                  <input className="form-control" type="search" placeholder="Search products..." aria-label="Search" required />
                  <button className="btn btn-primary" type="submit">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </form>
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0 text-white">
                {/* <li className="nav-item">
                  <NavLink className="nav-link" aria-current="page" to="/">
                    <div className="nav-icon-container">
                      <i className="fas fa-home"></i>
                      <span>Home</span>
                    </div>
                  </NavLink>
                </li> */}
                <li className="nav-item">
                  <NavLink className="nav-link" to="/user-listings">
                    <div className="nav-icon-container">
                      <i className="fas fa-store"></i>
                      <span>Listings</span>
                    </div>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/sell-device">
                    <div className="nav-icon-container">
                      <i className="fas fa-tag"></i>
                      <span>Sell</span>
                    </div>
                  </NavLink>
                </li>
                {user && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/my-listings">
                    <div className="nav-icon-container">
                      <i className="fas fa-list"></i>
                      <span>My Listings</span>
                    </div>
                  </NavLink>
                </li>
                )}
                {user ? (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/cart">
                        <div className="nav-icon-container">
                          <i className="fas fa-shopping-cart"></i>
                          <span>Cart</span>
                          {cartCount > 0 && (
                            <span className="cart-badge">{cartCount}</span>
                          )}
                        </div>
                      </NavLink>
                    </li>
                    <li className="nav-item dropdown" ref={dropdownRef}>
                      <button 
                        className={`nav-link dropdown-toggle ${isDropdownOpen ? 'show' : ''}`}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsDropdownOpen(!isDropdownOpen);
                        }}
                        aria-expanded={isDropdownOpen}
                      >
                        <div className="nav-icon-container">
                          <i className="fas fa-user"></i>
                          <span>{user.name?.split(' ')[0]}</span>
                        </div>
                      </button>
                      <ul className={`dropdown-menu dropdown-menu-end ${isDropdownOpen ? 'show' : ''}`}>
                        <li><NavLink className="dropdown-item" to="/profile" onClick={() => setIsDropdownOpen(false)}><i className="fas fa-id-card me-2"></i>Profile</NavLink></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><button className="dropdown-item" onClick={() => {
                          setIsDropdownOpen(false);
                          handleLogout();
                        }}><i className="fas fa-sign-out-alt me-2"></i>Logout</button></li>
                      </ul>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/login">
                        <div className="nav-icon-container">
                          <i className="fas fa-sign-in-alt"></i>
                          <span>Login</span>
                        </div>
                      </NavLink>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>

        
        </>
    );
};


export default Navbar;
