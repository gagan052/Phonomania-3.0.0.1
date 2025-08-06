import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from './ImageUploader';
import './Cart.css';

const ImageUploadDemo = () => {
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleImageUpload = (images) => {
    console.log('Uploaded images:', images);
    setUploadedImages(images);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="checkout-success-card mb-4">
            <h1 className="mb-4">Image Upload Demo</h1>
            <p className="success-message">
              This demo shows how to upload images to Cloudinary with the 'gagan' folder.
            </p>
            
            <ImageUploader 
              onImageUpload={handleImageUpload}
              folder="gagan"
              maxFiles={5}
            />
            
            {uploadedImages.length > 0 && (
              <div className="mt-4">
                <h3>Image URLs for Backend</h3>
                <div className="p-3 bg-light rounded">
                  <pre style={{ whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(uploadedImages, null, 2)}
                  </pre>
                </div>
                <p className="mt-3 text-muted">
                  These URLs can be saved to your database and used in your application.
                </p>
              </div>
            )}
            
            <div className="success-actions mt-4">
              <button 
                className="continue-shopping-btn" 
                onClick={() => navigate('/')}
              >
                <i className="fas fa-home"></i> Back to Home
              </button>
            </div>
          </div>
          
          <div className="checkout-success-card">
            <h3>How to Use the Image Uploader</h3>
            <div className="order-details text-left">
              <h4>1. Import the Component</h4>
              <pre className="bg-light p-2 rounded">
                {`import ImageUploader from './components/ImageUploader';`}
              </pre>
              
              <h4 className="mt-3">2. Add to Your Component</h4>
              <pre className="bg-light p-2 rounded">
                {`<ImageUploader 
  onImageUpload={(images) => console.log(images)}
  folder="gagan"
  maxFiles={5}
/>`}
              </pre>
              
              <h4 className="mt-3">3. Handle Uploaded Images</h4>
              <pre className="bg-light p-2 rounded">
                {`// The onImageUpload callback receives an array of objects:
[
  {
    url: "https://res.cloudinary.com/deb5enowt/image/upload/v1234/gagan/image1.jpg",
    publicId: "gagan/image1"
  },
  ...
]`}
              </pre>
              
              <h4 className="mt-3">4. Save to Your Database</h4>
              <p>
                Store these image URLs in your database associated with the relevant product or user data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadDemo;