import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

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

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('https://localhost:8081/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        setFormData({
          name: data.user.name,
          email: data.user.email,
          currentPassword: '',
          newPassword: ''
        });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://localhost:8081/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email
        })
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        setEditMode(false);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://localhost:8081/api/profile/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();
      if (response.ok) {
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: ''
        });
        setError('');
        alert('Password updated successfully');
        setEditMode(false);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to update password');
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
        <img src={user.avatar || 'https://via.placeholder.com/150'} alt="Profile" className="profile-avatar" />
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
