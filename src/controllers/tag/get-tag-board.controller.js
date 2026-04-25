import asyncHandler from "express-async-handler";
import { GetTagBoardService } from "../../services/tag/get-tag-board.service.js";
export const GetTagBoardController = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const tagId = req.params.tagId;

  const result = await GetTagBoardService(tagId, userId);

  res.status(200).json(result);
});
