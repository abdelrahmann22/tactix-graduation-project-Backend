import { CreateBoardService } from "../../services/tactical-board/create-board.service.js";
import asyncHandler from "express-async-handler";

export const CreateBoardController = asyncHandler(async (req, res) => {
  const data = req.body;
  const userId = req.user.userId;

  const result = await CreateBoardService(userId, data);

  res.status(201).json(result);
});
