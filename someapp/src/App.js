import React from "react";
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
import './index.css';
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
  </Routes>
  
     
     
      </>
    );

};
export default App;






