import asyncHandler from "express-async-handler";
import { sendPreSignedURLToClientService } from "../../services/tag/upload-tag-clip.service.js";
export const sendPreSignedURLToClientController = asyncHandler(
  async (req, res) => {
    const tagId = req.params.tagId;
    const userId = req.user.userId;

    const result = await sendPreSignedURLToClientService(tagId, userId);

    res.status(200).json(result);
  },
);
