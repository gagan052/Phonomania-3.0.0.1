import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import './Home.css';
const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleAddToCart = async (productId, quantity) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('https://phonomania-backend.onrender.com/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity })
      });

      const data = await response.json();
      if (response.ok) {
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        alert('Product added to cart successfully!');
      } else {
        alert(data.message || 'Failed to add product to cart. Please try again.');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Network error occurred. Please check your connection and try again.');
    }
  };
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
                 <div className="mt-4">
                     <a href="#products" className="hero-btn">Explore Phones</a>
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
              <img src="http://blog.olx.com.pk/wp-content/uploads/2022/02/Mobile-phones-1.jpg" className="d-block w-100" alt="Latest smartphone models" />
              <div className="carousel-caption d-none d-md-block">
                <h3>Latest Models Available</h3>
                <p>Get the newest technology at affordable prices</p>
              </div>
            </div>
            <div className="carousel-item">
              <img src="https://cdn.w600.comps.canstockphoto.com/smartphones-and-mobile-applications-clipart_csp13776419.jpg" className="d-block w-100" alt="Smartphone applications" />
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
      <section id="products" className="product-section">
        <div className="container">
          <h2 className="section-title mb-4">Featured Smartphones</h2>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            <div className="col">
              <div className="card" data-aos="zoom-in">
                <div className="card-badge">Best Seller</div>
                <img src="https://cdn.shopify.com/s/files/1/0568/5942/7015/products/MQ9P3HN_A_1.jpg?v=1662718624" className="card-img-top" alt="iPhone 14 Pro Max" />
                <div className="card-body">
                  <h5 className="card-title">iPhone 14 Pro Max</h5>
                  <p className="card-text">Special Edition Only Available On Phonomania</p>
                  <p className="price">₹1,20,999</p>
                  <div className="d-flex justify-content-between">
                    <button className="btn-cart" onClick={() => handleAddToCart('iphone14promax', 1)}>Add to Cart</button>
                    <button className="btn btn-outline-secondary">Details</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card" data-aos="zoom-in">
                <div className="card-badge">New</div>
                <img src="https://cdn1.smartprix.com/rx-izLSMVlI0-w1200-h1200/zLSMVlI0.jpg" className="card-img-top" alt="Samsung S23 Ultra" />
                <div className="card-body">
                  <h5 className="card-title">Samsung S23 Ultra</h5>
                  <p className="card-text">Special Edition Only Available On Phonomania</p>
                  <p className="price">₹1,27,999</p>
                  <div className="d-flex justify-content-between">
                    <button className="btn-cart" onClick={() => handleAddToCart('s23ultra', 1)}>Add to Cart</button>
                    <button className="btn btn-outline-secondary">Details</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card" data-aos="fade-right">
                <img src="https://images-cdn.ubuy.co.in/6340051ae566b8277211a103-huawei-p30-pro-128gb-8gb-ram-vog-l29.jpg" className="card-img-top" alt="Huawei P30 Pro" />
                <div className="card-body">
                  <h5 className="card-title">Huawei P30 Pro</h5>
                  <p className="card-text">Special Edition Only Available On Phonomania</p>
                  <p className="price">₹79,000</p>
                  <div className="d-flex justify-content-between">
                    <button className="btn-cart" onClick={() => handleAddToCart('p30pro', 1)}>Add to Cart</button>
                    <button className="btn btn-outline-secondary">Details</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card" data-aos="fade-left">
                <div className="card-badge">Limited</div>
                <img src="https://leronza.com/wp-content/uploads/2022/07/A1_24K_Gold_iPhone_14_Pro___Pro_Max_Flora_Edition-min.jpg" className="card-img-top" alt="iPhone 14 Pro Gold Edition" />
                <div className="card-body">
                  <h5 className="card-title">iPhone 14 Pro Gold Edition</h5>
                  <p className="card-text">Special Edition Only Available On Phonomania</p>
                  <p className="price">₹10,15,79,000</p>
                  <div className="d-flex justify-content-between">
                    <button className="btn-cart" onClick={() => handleAddToCart('iphone14progold', 1)}>Add to Cart</button>
                    <button className="btn btn-outline-secondary">Details</button>
                  </div>
                </div>
              </div>
            </div>
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
                    <span>Sector-71, Mohali, chandigarh</span>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-md-4 mb-30">
                <div className="single-cta">
                  <i className="fas fa-phone" />
                  <div className="cta-text">
                    <h4>Call us</h4>
                    <span>8507931092</span>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-md-4 mb-30">
                <div className="single-cta">
                  <i className="far fa-envelope-open" />
                  <div className="cta-text">
                    <h4>Mail us</h4>
                    <span>rishuarora850727@gmail.com</span>
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
                    <a href="#"><img src="https://img.icons8.com/fluency/2x/facebook-new.png" className="fab fa-facebook-f facebook-bg" /></a>
                    <a href="#"><img src="https://img.icons8.com/color/2x/whatsapp.png" className="fab fa-twitter twitter-bg" /></a>
                    <a href="#"><img src="https://img.icons8.com/fluency/2x/google-logo.png" className="fab fa-google-plus-g google-bg" /></a>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 mb-30">
                <div className="footer-widget">
                  <div className="footer-widget-heading">
                    <h3>Useful Links</h3>
                  </div>
                  <ul>
                    <li><a href="#">Home</a></li>
                    <li><a href="#">about</a></li>
                    <li><a href="#">services</a></li>
                    <li><a href="#">portfolio</a></li>
                    <li><a href="#">Contact</a></li>
                    <li><a href="#">About us</a></li>
                    <li><a href="#">Our Services</a></li>
                    <li><a href="#">Expert Team</a></li>
                    <li><a href="#">Contact us</a></li>
                    <li><a href="#">Latest News</a></li>
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
                <p><center>Copyright © 2023, All Right Reserved <a href="#">Rishu</a></center></p>
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
