require("dotenv").config();

const { HeadBucketCommand } = require("@aws-sdk/client-s3");

const s3 = require("./config/s3");

const testS3 = async () => {
  try {
    await s3.send(
      new HeadBucketCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
      }),
    );

    console.log("AWS S3 connection successful!");
  } catch (error) {
    console.error("AWS S3 connection failed:", error);
  }
};

testS3();
