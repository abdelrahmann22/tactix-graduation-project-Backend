import asyncHandler from "express-async-handler";
import { LinkTagToNewTacticalBoardService } from "../../services/tag/link-tacticalborad-to-tag.service.js";
export const LinkTagToNewTacticalBoardController = asyncHandler(
  async (req, res) => {
    const userId = req.user.userId;
    const tagId = req.params.tagId;

    const result = await LinkTagToNewTacticalBoardService(tagId, userId);

    res.status(200).json(result);
  },
);
