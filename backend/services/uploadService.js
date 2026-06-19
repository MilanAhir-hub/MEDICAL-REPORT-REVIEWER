import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = async (filePath, mimetype) => {

    //let declare the folder cleanly so that the images and pdf reports will store seperately in the cloudinary

    const isImage = mimetype.startsWith("image/");
    const folder = isImage ? "uploads/images" : "uploads/reports";

  const result = await cloudinary.uploader.upload(filePath, {
    folder: folder, 
    resource_type: "auto", // important: auto handles pdf + images
  });

  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
};

export default uploadToCloudinary;
