# Cloudinary Image Upload Setup

## Overview
This document provides instructions on how to set up Cloudinary for image uploads in the PhonomaniaStore project. The implementation uses the `ImageUploader` component which uploads images to the 'gagan' folder in your Cloudinary account.

## Prerequisites
1. A Cloudinary account (you can sign up for free at [cloudinary.com](https://cloudinary.com))
2. Your Cloudinary cloud name: `deb5enowt` (already configured in the code)

## Setup Instructions

### 1. Create an Upload Preset

The error message `Upload preset must be whitelisted for unsigned uploads` indicates that you need to create a properly configured upload preset in your Cloudinary dashboard.

1. Log in to your Cloudinary dashboard
2. Navigate to Settings > Upload
3. Scroll down to the "Upload presets" section
4. Click "Add upload preset"
5. Configure the preset:
   - **Preset name**: `gagan_preset` (as used in the code)
   - **Signing Mode**: Set to "Unsigned"
   - **Folder**: `gagan` (to ensure all uploads go to this folder)
   - **Overwrite**: Choose your preference (recommended: false)
   - **Transformation**: None (or set as needed)
6. Save the preset

### 2. Security Considerations

Using unsigned uploads is convenient for development but has security implications:

- Anyone who knows your cloud name and preset can upload to your account
- Consider implementing server-side signature generation for production
- Set upload limits in your Cloudinary dashboard to prevent abuse

### 3. Testing the Integration

1. Start your application
2. Navigate to `/image-upload` to access the demo page
3. Try uploading some images
4. If successful, you'll see the uploaded images and their URLs

### 4. Using the Component in Your Project

The `ImageUploader` component can be used in any part of your application:

```jsx
import ImageUploader from './components/ImageUploader';

// In your component
<ImageUploader 
  onImageUpload={(images) => {
    // Handle the uploaded images
    console.log(images);
    // Save to state or send to backend
  }}
  folder="gagan"
  maxFiles={5}
/>
```

## Troubleshooting

### Common Issues

1. **Upload fails with "Upload preset must be whitelisted"**
   - Ensure your upload preset is created and set to "Unsigned"
   - Verify the preset name in the code matches exactly what's in your Cloudinary dashboard

2. **CORS errors**
   - In your Cloudinary dashboard, go to Settings > Upload
   - Add your application domain to the "Allowed upload sources" section

3. **Upload works but images don't appear in the 'gagan' folder**
   - Check that both the preset configuration and the code specify the 'gagan' folder

## Additional Resources

- [Cloudinary Upload API Documentation](https://cloudinary.com/documentation/upload_images)
- [Cloudinary React SDK](https://cloudinary.com/documentation/react_integration)
- [Cloudinary Upload Presets](https://cloudinary.com/documentation/upload_presets)