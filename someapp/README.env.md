# Environment Variables for PhonomaniaStore

This document explains the environment variables used in the PhonomaniaStore application.

## Setup Instructions

1. Create a `.env` file in the root of the `someapp` directory
2. Add the environment variables as shown below
3. Restart your development server if it's already running

## Environment Variables

```
# API Keys
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
REACT_APP_CLOUDINARY_API_KEY=your_cloudinary_api_key
REACT_APP_CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Backend API URL
REACT_APP_API_URL=http://localhost:5000/api

# Authentication
REACT_APP_JWT_SECRET=your-secret-key

# Other Configuration
REACT_APP_MAX_UPLOAD_SIZE=5
REACT_APP_DEFAULT_UPLOAD_FOLDER=device-listings
```

## Important Notes

- All React environment variables must start with `REACT_APP_` to be accessible in the application
- The `.env` file should never be committed to version control
- Make sure to add `.env` to your `.gitignore` file
- For production, set these variables in your hosting environment

## Using Environment Variables in Code

Access environment variables in your React components like this:

```javascript
// Example usage
const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const apiUrl = process.env.REACT_APP_API_URL;
```

## Default Values

When environment variables are not set, you can provide fallbacks:

```javascript
const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'default_cloud_name';
```