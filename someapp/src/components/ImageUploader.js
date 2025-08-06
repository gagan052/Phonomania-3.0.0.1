import React, { useState } from 'react';
import './Cart.css';

const ImageUploader = ({ onImageUpload, folder = 'device-listings', maxFiles = 5 }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedImages, setUploadedImages] = useState([]);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate file types
    const validFiles = selectedFiles.filter(file => 
      file.type.match('image.*')
    );
    
    if (validFiles.length !== selectedFiles.length) {
      setError('Only image files are allowed');
      return;
    }
    
    // Check max files limit
    if (validFiles.length + files.length > maxFiles) {
      setError(`You can upload maximum ${maxFiles} images`);
      return;
    }
    
    setError('');
    setFiles([...files, ...validFiles]);
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const uploadFile = async (file, index) => {
    try {
      // Create a new FormData instance
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'SkillAble'); // Using the preset from env
      formData.append('folder', folder); // Using the folder passed as prop or default
      // This preset must be created in your Cloudinary dashboard
      // and set to 'unsigned' mode for this to work
      
      console.log(`Uploading file ${index} to Cloudinary with folder: ${folder}`);

      // Track upload progress
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'deb5enowt'}/image/upload`);
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(prev => ({
            ...prev,
            [index]: progress
          }));
        }
      };
      
      return new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              // Check if response is valid JSON
              const contentType = xhr.getResponseHeader('content-type');
              if (contentType && contentType.includes('application/json')) {
                const response = JSON.parse(xhr.responseText);
                console.log('Cloudinary response:', response);
                console.log('Image uploaded to folder:', response.folder, 'with public_id:', response.public_id);
                resolve(response);
              } else {
                console.error('Cloudinary returned non-JSON response:', xhr.responseText);
                reject(new Error('Image upload service returned an invalid response'));
              }
            } catch (e) {
              console.error('Error parsing Cloudinary response:', e, xhr.responseText);
              reject(new Error('Failed to process the image upload response'));
            }
          } else {
            // Try to parse error response for more details
            try {
              const errorResponse = JSON.parse(xhr.responseText);
              console.error('Cloudinary error details:', errorResponse);
              reject(new Error(`Upload failed: ${errorResponse.error?.message || 'Unknown error'}`));
            } catch (e) {
              console.error('Error parsing Cloudinary error response:', e, xhr.responseText);
              reject(new Error(`Upload failed with status: ${xhr.status}`));
            }
          }
        };
        
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(formData);
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select at least one image to upload');
      return;
    }

    setUploading(true);
    setError('');
    
    // Debug information
    console.log('Starting upload with folder:', folder);
    
    try {
      const uploadPromises = files.map((file, index) => uploadFile(file, index));
      const results = await Promise.all(uploadPromises);
      
      const uploadedUrls = results.map(result => ({
        url: result.secure_url,
        publicId: result.public_id
      }));
      
      console.log('All images uploaded successfully:', uploadedUrls);
      setUploadedImages(uploadedUrls);
      setFiles([]);
      setUploadProgress({});
      
      // Call the callback with uploaded images
      if (onImageUpload) {
        onImageUpload(uploadedUrls);
      }
    } catch (error) {
      setError(`Failed to upload images: ${error.message || 'Please check your internet connection and try again.'}`);
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-uploader-container">
      <div className="image-uploader-header">
        <h3>Upload Images</h3>
        <p className="image-uploader-info">
          Select up to {maxFiles} images to upload
        </p>
      </div>
      
      {error && <div className="image-uploader-error">{error}</div>}
      
      <div className="image-uploader-dropzone">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          id="file-input"
          disabled={uploading}
          className="image-uploader-input"
        />
        <label htmlFor="file-input" className="image-uploader-label">
          <i className="fas fa-cloud-upload-alt"></i>
          <span>Click to select images</span>
        </label>
      </div>
      
      {files.length > 0 && (
        <div className="image-uploader-preview">
          <h4>Selected Files ({files.length})</h4>
          <div className="image-uploader-files">
            {files.map((file, index) => (
              <div key={index} className="image-uploader-file">
                <div className="image-uploader-file-preview">
                  <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} />
                </div>
                <div className="image-uploader-file-info">
                  <span className="image-uploader-file-name">{file.name}</span>
                  <span className="image-uploader-file-size">
                    {(file.size / 1024).toFixed(2)} KB
                  </span>
                </div>
                {uploadProgress[index] !== undefined && (
                  <div className="image-uploader-progress">
                    <div 
                      className="image-uploader-progress-bar" 
                      style={{ width: `${uploadProgress[index]}%` }}
                    ></div>
                    <span>{uploadProgress[index]}%</span>
                  </div>
                )}
                <button 
                  className="image-uploader-remove-btn" 
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
          <button 
            className="image-uploader-upload-btn" 
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Uploading...
              </>
            ) : (
              <>
                <i className="fas fa-upload"></i> Upload Images
              </>
            )}
          </button>
        </div>
      )}
      
      {uploadedImages.length > 0 && (
        <div className="image-uploader-results">
          <h4>Uploaded Images</h4>
          <div className="image-uploader-gallery">
            {uploadedImages.map((image, index) => (
              <div key={index} className="image-uploader-gallery-item">
                <img src={image.url} alt={`Uploaded ${index}`} />
                <div className="image-uploader-gallery-item-overlay">
                  <button 
                    className="image-uploader-copy-btn"
                    onClick={() => navigator.clipboard.writeText(image.url)}
                  >
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;