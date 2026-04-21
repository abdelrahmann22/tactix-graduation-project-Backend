import { v4 as uuid } from "uuid";
import dotenv from "dotenv";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../config/aws.config.js";
import { AppError } from "../../utils/app.error.js";

dotenv.config();
export const generateUploadURL = async (tagId) => {
  try {
    const key = `tags/${tagId}.mp4`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      ContentType: "video/mp4",
    });

    const url = await getSignedUrl(s3, command, {
      expiresIn: 60 * 10,
    });
    console.log("presigned url", url);
    return {
      url,
      key,
    };
  } catch (err) {
    console.log(err);
    throw new AppError(500, err.message || "error in sending the url");
  }
};
