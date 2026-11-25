// src/utils/s3Upload.js
import axios from "axios";

/**
 * Upload a File directly to AWS S3 using a pre-signed URL.
 *
 * @param {File} file
 * @param {string} folder e.g. "avatars" or "chat-media"
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
export const uploadToS3 = async (file, folder = "chat-media") => {
  try {
    // 1. Get the pre-signed URL from our backend
    const { data } = await axios.post(
      "http://localhost:5000/api/messages/generate-upload-url",
      {
        fileName: file.name,
        fileType: file.type,
        folder: folder,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    const { uploadUrl, fileUrl, key } = data;

    // 2. Upload the file directly to S3
    // Note: We use native fetch here. Do NOT use axios if you have global
    // interceptors adding auth headers, as S3 will reject them.
    const s3Response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        // This MUST exactly match the ContentType signed by the backend
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!s3Response.ok) {
      // If S3 rejects it, read the XML error to see EXACTLY why
      const errorText = await s3Response.text();
      console.error("S3 Rejection Reason:", errorText);
      throw new Error(`S3 Upload Failed with status: ${s3Response.status}`);
    }

    // 3. Return the data in the same format Cloudinary did
    return {
      secure_url: fileUrl,
      public_id: key,
    };
  } catch (error) {
    console.error("S3 Upload Error:", error);
    throw new Error(
      error.response?.data?.error || error.message || "File upload failed",
    );
  }
};
