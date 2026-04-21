import { AWSHeadObject } from "../aws/aws-confirm-upload.service.js";
import { Tag } from "../../models/tags.model.js";
import { AppError } from "../../utils/app.error.js";
import dotenv from "dotenv";

dotenv.config();

export const VerifiyTagUploadService = async (tagId, userId) => {
  try {
    const tag = await Tag.findById(tagId).populate("matchId");
    if (!tag) throw new AppError(404, "tag not found");

    if (tag.matchId.userId.toString() !== userId.toString())
      throw new AppError(403, "you are not authorized");

    const key = `tags/${tagId}.mp4`;

    const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    await AWSHeadObject(key);

    tag.clipURL = fileUrl;
    return {
      success: true,
      message: "Clip Uploaded Successfully",
      data: fileUrl,
    };
  } catch (err) {
    console.log(err);
    throw new AppError(
      500,
      err.message || "URL May not Uploaded Yet Verify Later...",
    );
  }
};
