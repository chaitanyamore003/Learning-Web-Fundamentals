import cloudinary from "../config/cloudinary.js";

const testCloudinary = async () => {
  try {
    const result = await cloudinary.api.ping();

    console.log("Cloudinary Connected Successfully!");
    console.log(result);
  } catch (error) {
    console.error("Cloudinary Connection Failed:", error.message);
  }
};

testCloudinary();
