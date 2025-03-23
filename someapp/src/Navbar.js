import React, { useState, useEffect, useRef } from "react";
import './index.css';
import './Home.css';
import './Navbar.css';
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
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

    window.addEventListener('authStateChange', handleAuthChange);
    return () => window.removeEventListener('authStateChange', handleAuthChange);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:8080/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setCartCount(data.items.length);
      }
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
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
          <div className="container">
            <div className="d-flex align-items-center">
              <img src="https://thumbs.dreamstime.com/b/vector-graphic-emblem-hexagon-initials-letter-pm-logo-design-template-vector-graphic-initials-letter-pm-logo-design-template-204622998.jpg" height="40px" className="me-2" alt="PhoneMania Logo"/>
              <NavLink className="navbar-brand fw-bold" to="/">PHONOMANIA</NavLink>
            </div>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <form className="d-flex mx-auto" style={{width: '40%'}}>
                <div className="input-group">
                  <input className="form-control" type="search" placeholder="Search for smartphones..." aria-label="Search" />
                  <button className="btn btn-primary" type="submit">
                    <i className="fas fa-search"></i> Search
                  </button>
                </div>
              </form>
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <NavLink className="nav-link" aria-current="page" to="/">Home</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/About">About</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/Contact">Contact</NavLink>
                </li>
                {user ? (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/cart">
                        <span className="position-relative">
                          <i className="fas fa-shopping-cart fs-5"></i>
                          {cartCount > 0 && (
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                              {cartCount}
                            </span>
                          )}
                        </span>
                      </NavLink>
                    </li>
                    <li className="nav-item dropdown" ref={dropdownRef}>
                      <a 
                        className={`nav-link dropdown-toggle ${isDropdownOpen ? 'show' : ''}`}
                        href="#"
                        role="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsDropdownOpen(!isDropdownOpen);
                        }}
                        aria-expanded={isDropdownOpen}
                      >
                        <i className="fas fa-user fs-5"></i>
                      </a>
                      <ul className={`dropdown-menu dropdown-menu-end ${isDropdownOpen ? 'show' : ''}`}>
                        <li><NavLink className="dropdown-item" to="/profile" onClick={() => setIsDropdownOpen(false)}>Profile</NavLink></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><button className="dropdown-item" onClick={() => {
                          setIsDropdownOpen(false);
                          handleLogout();
                        }}>Logout</button></li>
                      </ul>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/login">Login</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/register">Register</NavLink>
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