import { GetAllUserBoardsService } from "../../services/tactical-board/get-user-boards.service.js";
import asyncHandler from "express-async-handler";

export const GetAllUserBoardsController = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const result = await GetAllUserBoardsService(userId);

  res.status(201).json(result);
});
