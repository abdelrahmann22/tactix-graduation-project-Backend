import { GetBoardByIdService } from "../../services/tactical-board/get-board-by-id.service.js";
import asyncHandler from "express-async-handler";

export const GetBoardByIdController = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const boardId = req.params.boardId;

  const result = await GetBoardByIdService(userId, boardId);

  res.status(200).json(result);
});
