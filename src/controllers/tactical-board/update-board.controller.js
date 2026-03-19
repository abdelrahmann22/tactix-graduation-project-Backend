import { UpdateBoardService } from "../../services/tactical-board/update-board.service.js";
import asyncHandler from "express-async-handler";

export const UpdateBoardController = asyncHandler(async (req, res) => {
  const data = req.body;
  const userId = req.user.userId;
  const boardId = req.params.boardId;

  const result = await UpdateBoardService(userId, boardId, data);
  res.status(200).json(result);
});
