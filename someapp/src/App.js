import React from "react";
import "regenerator-runtime/runtime";

import {Route , Routes} from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";

// Font Awesome for icons
import '@fortawesome/fontawesome-free/css/all.min.css';
import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import Navbar from "./Navbar";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Register from "./components/Register";
import Cart from "./components/Cart";
import CheckoutSuccess from "./components/CheckoutSuccess";
import ImageUploadDemo from "./components/ImageUploadDemo";
import SellDevice from "./components/SellDevice";
import UserListings from "./components/UserListings";
import AllUserListings from "./components/AllUserListings";
import SearchResults from "./components/SearchResults";
import './index.css';

// Amazon-inspired styles
import './amazon-theme.css';
const App = () =>{
   
    return(
      <>
      <Navbar />

      
  <Routes>
    <Route path="/" element={<Home />}/>
    <Route path="/about" element={<About />}/>
    <Route path="/contact" element={<Contact />}/>
    <Route path="/profile" element={<Profile />}/>
    <Route path="/login" element={<Login />}/>
    <Route path="/register" element={<Register />}/>
    <Route path="/cart" element={<Cart />}/>
    <Route path="/checkout-success" element={<CheckoutSuccess />}/>
    <Route path="/image-upload" element={<ImageUploadDemo />}/>
    <Route path="/sell-device" element={<SellDevice />}/>
    <Route path="/my-listings" element={<UserListings />}/>
    <Route path="/user-listings" element={<AllUserListings />}/>
    <Route path="/search" element={<SearchResults />}/>
  </Routes>
  
     
     
      </>
    );

};
export default App;






