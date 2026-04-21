import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../config/aws.config.js";
import dotenv from "dotenv";
import { AppError } from "../../utils/app.error.js";
dotenv.config();
export const AWSHeadObject = async (key) => {
  try {
    await s3.send(
      new HeadObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
      }),
    );
  } catch (error) {
    console.log(error);
    throw new AppError(500, error || "Error in verifying the Head Object ");
  }
};
