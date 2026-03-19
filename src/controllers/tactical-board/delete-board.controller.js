import asyncHandler from "express-async-handler";
import { DeleteBoardByIdService } from "../../services/tactical-board/delete-board.service.js";

export const DeleteBoardByIdController = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const boardId = req.params.boardId;

  const result = await DeleteBoardByIdService(userId, boardId);

  res.status(200).json(result);
});
