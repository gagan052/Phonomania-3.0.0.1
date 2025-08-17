import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from './ImageUploader';
import apiService from '../utils/new-request';
import './Cart.css';
import '../amazon-theme.css';

const SellDevice = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Smartphones',
    brand: '',
    stock: '1',
    condition: 'Used'
  });

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleImageUpload = (images) => {
    setUploadedImages(images);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (uploadedImages.length === 0) {
      setError('Please upload at least one image of your device');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Format the data for the API
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        images: uploadedImages.map(img => ({ url: img.url })),
        seller: user._id
      };
      
      console.log('Submitting product data:', productData);

      // // Use the imported apiService directly
      // const response = await apiService.createListing(productData);
      // console.log('API response:', response);

      // if (response.success) {
      //   setSuccess(true);
      //   setFormData({
      //     name: '',
      //     description: '',
      //     price: '',
      //     category: 'Smartphones',
      //     brand: '',
      //     stock: '1',
      //     condition: 'Used'
      //   });
      //   setUploadedImages([]);
      // } else {
      //   throw new Error(response.message || 'Failed to list your device');
      // }


      // Use the imported apiService directly
const response = await apiService.createListing(productData);
console.log('API response:', response);

// Check backend success flag
if (response.status === 201) {
  setSuccess(true);
  setFormData({
    name: '',
    description: '',
    price: '',
    category: 'Smartphones',
    brand: '',
    stock: '1',
    condition: 'Used'
  });
  setUploadedImages([]);
} else {
  throw new Error(response.data?.message || 'Failed to list your device');
}

    } catch (error) {
      console.error('Error submitting listing:', error);
      // Provide more specific error messages based on the error
      if (error.message.includes('invalid response')) {
        setError('The server is currently unavailable. Please try again later.');
      } else if (error.message.includes('Failed to fetch')) {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError(error.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="checkout-success-card" style={{backgroundColor: '#fff', borderRadius: '8px', padding: '2rem', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'}}>
              <div className="success-icon" style={{color: 'var(--amazon-success)', fontSize: '4rem', marginBottom: '1rem'}}>
                <i className="fas fa-check-circle"></i>
              </div>
              <h1 style={{color: 'var(--amazon-secondary)'}}>Listing Successful!</h1>
              <p className="success-message" style={{fontSize: '1.1rem', marginBottom: '2rem'}}>
                Your device has been listed successfully and is now available for sale.
              </p>
              <div className="success-actions">
                <button 
                  className="btn btn-amazon me-2" 
                  onClick={() => navigate('/')}
                >
                  <i className="fas fa-home me-2"></i> Go to Home
                </button>
                <button 
                  className="btn btn-amazon-secondary" 
                  onClick={() => setSuccess(false)}
                >
                  <i className="fas fa-plus me-2"></i> List Another Device
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="image-uploader-container" style={{backgroundColor: '#fff', borderRadius: '8px', padding: '2rem', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'}}>
            <div className="image-uploader-header">
              <h1 className="mb-3" style={{color: 'var(--amazon-secondary)'}}><i className="fas fa-tag me-2"></i>Sell Your Device</h1>
              <p className="image-uploader-info">
                List your smartphone or accessory for sale on PhonomaniaStore. 
                Fill out the details below and upload clear images of your device.
              </p>
            </div>

            {error && (
              <div className="image-uploader-error">
                <i className="fas fa-exclamation-circle me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Device Name*</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. iPhone 13 Pro Max"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="brand" className="form-label">Brand*</label>
                    <input
                      type="text"
                      className="form-control"
                      id="brand"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Apple, Samsung, etc."
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="price" className="form-label">Price ($)*</label>
                    <input
                      type="number"
                      className="form-control"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="1"
                      step="0.01"
                      placeholder="Enter price in USD"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">Category*</label>
                    <select
                      className="form-select"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="Smartphones">Smartphones</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="condition" className="form-label">Condition*</label>
                    <select
                      className="form-select"
                      id="condition"
                      name="condition"
                      value={formData.condition}
                      onChange={handleChange}
                      required
                    >
                      <option value="New">New</option>
                      <option value="Like New">Like New</option>
                      <option value="Used">Used</option>
                      <option value="Refurbished">Refurbished</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="stock" className="form-label">Quantity*</label>
                    <input
                      type="number"
                      className="form-control"
                      id="stock"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                      min="1"
                      max="99"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description*</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows="4"
                      placeholder="Describe your device's condition, specifications, and any other relevant details"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label">Device Images*</label>
                <ImageUploader 
                  onImageUpload={handleImageUpload}
                  folder={process.env.REACT_APP_DEFAULT_UPLOAD_FOLDER || "device-listings"}
                  maxFiles={5}
                />
                {uploadedImages.length > 0 && (
                  <div className="mt-2 text-success">
                    <i className="fas fa-check-circle me-2"></i>
                    {uploadedImages.length} image(s) uploaded successfully
                  </div>
                )}
              </div>

              <div className="d-grid gap-2">
                <button 
                  type="submit" 
                  className="btn btn-amazon btn-lg"
                  disabled={loading}
                  style={{fontSize: '1.1rem', padding: '0.75rem'}}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin me-2"></i>
                      Listing Your Device...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-tag me-2"></i>
                      List Device for Sale
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellDevice;