import React from 'react';
import './index.css';
import './Home.css';

const About = () =>{
     return(
        <>
        <section id="header">
          <div className="container py-5">
            <div className="row align-items-center">
              <div className="col-md-6 order-2 order-lg-1">
                <h1 className="hero-heading">About <strong className="brand">PhoneMania</strong></h1> 
                <h4 className="hero-subheading mb-4">Your Trusted Marketplace for Premium Used Smartphones</h4>
                <p className="mb-4">At PhoneMania, we're passionate about connecting people with high-quality used smartphones at affordable prices. Our curated selection ensures you get the best value without compromising on quality or performance.</p>
                <div className="mb-4">
                  <a href="/Contact" className="hero-btn">Contact Us</a>
                </div> 
              </div>

              <div className="col-lg-6 order-1 order-lg-2 mb-5 mb-lg-0">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZacEYXutfknOXOKd7ldzW77QzGQQzY2IARA&usqp=CAU" className="img-fluid rounded shadow-lg hero-image" alt="About PhoneMania"/>   
              </div>  
            </div>
          </div>
        </section>
        
        <section className="py-5 bg-light">
          <div className="container">
            <h2 className="section-title mb-5">Why Choose Us</h2>
            
            <div className="row g-4">
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center p-4">
                    <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3" style={{width: '70px', height: '70px'}}>
                      <i className="fas fa-check-circle fs-2"></i>
                    </div>
                    <h4 className="card-title">Quality Assurance</h4>
                    <p className="card-text">Every smartphone undergoes rigorous testing and certification before being listed on our platform.</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center p-4">
                    <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3" style={{width: '70px', height: '70px'}}>
                      <i className="fas fa-wallet fs-2"></i>
                    </div>
                    <h4 className="card-title">Best Prices</h4>
                    <p className="card-text">We offer competitive pricing on all our products, ensuring you get the best value for your money.</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center p-4">
                    <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3" style={{width: '70px', height: '70px'}}>
                      <i className="fas fa-headset fs-2"></i>
                    </div>
                    <h4 className="card-title">Customer Support</h4>
                    <p className="card-text">Our dedicated support team is always ready to assist you with any questions or concerns.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
   </>
   );
};

export default About;