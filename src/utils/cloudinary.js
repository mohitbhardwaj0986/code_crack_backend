// cloudinaryUploader.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload buffer to Cloudinary
const uploadBufferToCloudinary = async (fileBuffer, fileFormat = "jpg") => {
  try {
    return await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          format: fileFormat, // like 'jpg', 'png', 'pdf' etc.
        },
        (error, result) => {
          console.log(error);
          
          if (error) return reject(error);
          resolve(result);
        }
      );

      stream.end(fileBuffer);
    });
  } catch (error) {

    return null;
  }
};

export { uploadBufferToCloudinary };
