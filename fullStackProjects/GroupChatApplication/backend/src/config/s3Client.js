import { S3Client } from "@aws-sdk/client-s3";

// The AWS SDK will automatically look for AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,
// and AWS_SESSION_TOKEN in your .env file.
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

export default s3Client;
