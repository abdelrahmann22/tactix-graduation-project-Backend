import asyncHandler from "express-async-handler";
import { getChatsService } from "../../services/llm/get-chats.service.js";

export const getChatsController = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const userId = req.user.userId;

  const result = await getChatsService(userId, type);
  res.status(200).json(result);
});
