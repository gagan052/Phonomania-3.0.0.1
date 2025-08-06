import React, { useState } from 'react';
import upload from '../utils/cloudinaryUpload';
import './Cart.css';

const CloudinaryUploadDemo = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file is an image
      if (!selectedFile.type.match('image.*')) {
        setError('Please select an image file');
        return;
      }
      
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError('');
    
    try {
      // Use our cloudinaryUpload utility
      const imageUrl = await upload(file);
      setUploadedUrl(imageUrl);
      setFile(null); // Reset file selection
      
      // Reset file input
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      setError('Upload failed: ' + (err.message || 'Unknown error'));
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="checkout-success-card">
            <h2>Cloudinary Upload Demo (SkillAble)</h2>
            <p className="text-muted">This demo uses the new cloudinaryUpload utility</p>
            
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            
            <div className="mb-3">
              <label htmlFor="file-input" className="form-label">Select Image</label>
              <input
                type="file"
                className="form-control"
                id="file-input"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </div>
            
            {file && (
              <div className="mb-3">
                <div className="card p-2">
                  <div className="d-flex align-items-center">
                    <div style={{ width: '60px', height: '60px', overflow: 'hidden' }}>
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt="Preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                    <div className="ms-3">
                      <p className="mb-0">{file.name}</p>
                      <small className="text-muted">{(file.size / 1024).toFixed(2)} KB</small>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <button
              className="btn btn-primary w-100"
              onClick={handleUpload}
              disabled={!file || uploading}
            >
              {uploading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Uploading...
                </>
              ) : 'Upload to Cloudinary'}
            </button>
            
            {uploadedUrl && (
              <div className="mt-4">
                <h4>Upload Successful!</h4>
                <div className="card mb-3">
                  <img 
                    src={uploadedUrl} 
                    alt="Uploaded" 
                    className="card-img-top" 
                    style={{ maxHeight: '300px', objectFit: 'contain' }} 
                  />
                  <div className="card-body">
                    <h5 className="card-title">Image URL</h5>
                    <div className="input-group">
                      <input 
                        type="text" 
                        className="form-control" 
                        value={uploadedUrl} 
                        readOnly 
                      />
                      <button 
                        className="btn btn-outline-secondary" 
                        type="button"
                        onClick={() => navigator.clipboard.writeText(uploadedUrl)}
                      >
                        Copy
                      </button>
                    </div>
                    <p className="card-text mt-2">
                      <small className="text-muted">This URL can be saved to your database</small>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloudinaryUploadDemo;