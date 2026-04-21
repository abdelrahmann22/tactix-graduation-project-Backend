import { generateUploadURL } from "../aws/aws.service.js";
import { Tag } from "../../models/tags.model.js";
import { AppError } from "../../utils/app.error.js";
export const sendPreSignedURLToClientService = async (tagId, userId) => {
  try {
    const tag = await Tag.findById(tagId).populate("matchId");
    if (!tag) throw new AppError(404, "tag not found");

    if (tag.matchId.userId.toString() !== userId.toString())
      throw new AppError(403, "you are not authorized");

    const awsResult = await generateUploadURL(tagId);
    return {
      success: true,
      message: "url successfully sent",
      data: awsResult,
    };
  } catch (err) {
    console.log(err);
    throw new AppError(500, err.message || "error in sending the url");
  }
};
