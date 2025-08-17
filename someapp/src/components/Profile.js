import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import apiService from '../utils/new-request';
import ImageUploader from './ImageUploader';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: ''
  });

  const fetchUserProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await apiService.getProfile();
      const data = response.data;
      
      setUser(data.user);
      setFormData({
        name: data.user.name,
        email: data.user.email,
        currentPassword: '',
        newPassword: ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      } else if (error.response) {
        setError(error.response.data.message || 'Failed to fetch profile');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar
      };
      
      const response = await apiService.updateProfile(userData);
      setUser(response.data.user);
      setEditMode(false);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Failed to update profile');
      } else {
        setError('Network error. Please try again.');
      }
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const passwordData = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      };
      
      await apiService.changePassword(passwordData);
      
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: ''
      });
      setError('');
      alert('Password updated successfully');
      setEditMode(false);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Failed to update password');
      } else {
        setError('Network error. Please try again.');
      }
    }
  };

  if (loading) {
    return <div className="profile-container">Loading...</div>;
  }

  if (error) {
    return <div className="profile-container error">{error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img 
            src={user?.avatar || 'https://res.cloudinary.com/dknvsbuyy/image/upload/v1686314044/avatars/default_user_f5ra1b.png'} 
            alt={user?.name} 
            className="avatar-image"
          />
        </div>
        <h2>{user.name}</h2>
        <p className="user-stats">
          <span><i className="fas fa-shopping-cart"></i> Orders: 12</span>
          <span><i className="fas fa-star"></i> Reviews: 5</span>
          <span><i className="fas fa-heart"></i> Wishlist: 8</span>
        </p>
      </div>

      <div className="profile-content">
        <div className="activity-timeline">
          <h3><i className="fas fa-history"></i> Recent Activity</h3>
          <div className="timeline-item">
            <div className="timeline-date">Today</div>
            <div className="timeline-content">
              <p><i className="fas fa-shopping-cart"></i> Purchased iPhone 14 Pro</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-date">Yesterday</div>
            <div className="timeline-content">
              <p><i className="fas fa-star"></i> Reviewed Samsung Galaxy S23</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-date">3 days ago</div>
            <div className="timeline-content">
              <p><i className="fas fa-heart"></i> Added 3 items to wishlist</p>
            </div>
          </div>
        </div>

        {editMode ? (
          <form onSubmit={handleSubmit} className="profile-form">
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
                <label>Profile Image:</label>
                <div className="profile-image-edit">
                  <img 
                    src={formData.avatar || 'https://res.cloudinary.com/dknvsbuyy/image/upload/v1686314044/avatars/default_user_f5ra1b.png'} 
                    alt="Profile" 
                    className="edit-avatar-preview" 
                  />
                  <div className="avatar-upload-controls">
                    <ImageUploader 
                      onImageUpload={(images) => {
                        if (images && images.length > 0) {
                          setFormData({...formData, avatar: images[0].url});
                        }
                      }} 
                      folder="avatars" 
                      maxFiles={1} 
                    />
                  </div>
                </div>
              </div>
            <div className="button-group">
              <button type="submit" className="btn-save">Save Changes</button>
              <button type="button" className="btn-cancel" onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-header">
              <h3><i className="fas fa-user-circle"></i> Personal Information</h3>
            </div>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Member Since:</strong> {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
            <button className="btn-edit" onClick={() => setEditMode(true)}>
              <i className="fas fa-edit"></i> Edit Profile
            </button>
          </div>
        )}

        <div className="password-section">
          <h3>Change Password</h3>
          <form onSubmit={handlePasswordChange} className="password-form">
            <div className="form-group">
              <label>Current Password:</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>New Password:</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="btn-change-password">Change Password</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
