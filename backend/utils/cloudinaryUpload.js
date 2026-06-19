import cloudinary from "../config/cloudinary.js"
import streamifier from "streamifier"; //needed to convert buffer to stream because cloudinary expect stream

export const uploadToCloudinary = (fileBuffer, folderName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    // convert buffer to stream(stream means data is being sent in chunks). in diskStorage we are storing the entire file at once not in chunks
    streamifier.createReadStream(fileBuffer).pipe(uploadStream); //pipe is used to connect the streamifier to the uploadStream
  });
};
export default uploadToCloudinary;