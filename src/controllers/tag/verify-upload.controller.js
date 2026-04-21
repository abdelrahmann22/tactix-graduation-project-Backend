import asyncHandler from "express-async-handler";
import { VerifiyTagUploadService } from "../../services/tag/verify-tag-upload.service.js";
export const VerifiyTagUploadController = asyncHandler(async (req, res) => {
  const tagId = req.params.tagId;
  const userId = req.user.userId;

  const result = await VerifiyTagUploadService(tagId, userId);

  res.status(200).json(result);
});
