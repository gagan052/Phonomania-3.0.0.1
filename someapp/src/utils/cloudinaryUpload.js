import axios from "axios";

/**
 * Uploads a file to Cloudinary using the SkillAble preset and folder
 * @param {File} file - The file object to upload
 * @returns {Promise<string>} - The URL of the uploaded image
 */
const upload = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "gagan_preset"); // Using preset from CLOUDINARY_SETUP.md
  data.append("folder", "gagan"); // Using folder from CLOUDINARY_SETUP.md

  try {
    // Using axios to post to Cloudinary API with environment variables
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "deb5enowt";
    const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, data);

    // Extract the secure URL from the response
    const { secure_url } = res.data;
    return secure_url;
  } catch (err) {
    console.error("Error uploading to Cloudinary:", err);
    throw new Error("Failed to upload image. Please check your Cloudinary configuration.");
  }
};

export default upload;