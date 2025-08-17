import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import apiService from '../utils/new-request';
import ImageUploader from './ImageUploader';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    avatar: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (uploadedImages) => {
    if (uploadedImages && uploadedImages.length > 0) {
      setFormData({
        ...formData,
        avatar: uploadedImages[0].url
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.register(formData);
      const data = response.data;
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('authStateChange'));
      navigate('/');
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(error.response.data.message || 'Registration failed');
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response from server. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('Error: ' + error.message);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Register</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength="8"
            />
          </div>
          <div className="form-group">
            <label>Profile Image:</label>
            <div className="profile-image-upload">
              {formData.avatar ? (
                <div className="preview-container">
                  <img 
                    src={formData.avatar} 
                    alt="Profile Preview" 
                    className="profile-image-preview" 
                  />
                  <button 
                    type="button" 
                    className="remove-image-btn"
                    onClick={() => setFormData({...formData, avatar: ''})}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <ImageUploader 
                  onImageUpload={handleImageUpload} 
                  folder="avatars" 
                  maxFiles={1} 
                />
              )}
            </div>
          </div>
          <button type="submit" className="auth-button">Register</button>
        </form>
        <p className="auth-link">
          Already have an account? <span onClick={() => navigate('/login')}>Login here</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
