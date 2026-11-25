// src/routes/media.routes.js (or wherever this file lives)
import express from "express";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "../../config/s3Client.js";

const router = express.Router();

router.post("/generate-upload-url", async (req, res) => {
  try {
    const { fileName, fileType, folder = "uploads" } = req.body;

    if (!fileName || !fileType) {
      return res
        .status(400)
        .json({ error: "fileName and fileType are required." });
    }

    // Sanitize the filename to prevent URL encoding issues (e.g., spaces becoming %20)
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, "_");

    // Create key like: avatars/171234567-image.jpg OR chat-media/171234567-video.mp4
    const key = `${folder}/${Date.now()}-${sanitizedFileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
      // 👇 CRITICAL FIX: Prevent AWS SDK v3 from adding default checksums
      // which break standard browser fetch() PUT requests.
      ChecksumAlgorithm: undefined,
    });

    // Increased to 300 seconds (5 mins) to give the user time to upload
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    res.status(200).json({
      uploadUrl,
      fileUrl,
      key,
    });
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    res.status(500).json({ error: "Failed to generate upload URL." });
  }
});

export default router;
