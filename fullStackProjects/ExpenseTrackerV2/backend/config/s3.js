// Import S3Client from AWS SDK
const { S3Client } = require("@aws-sdk/client-s3");

// Create an S3 client instance
const s3 = new S3Client({
  region: process.env.AWS_REGION,

  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Export the S3 client
module.exports = s3;
