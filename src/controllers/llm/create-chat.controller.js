import asyncHandler from "express-async-handler";
import { createChatService } from "../../services/llm/create-chat.service.js";

export const createChatController = asyncHandler(async (req, res) => {
  const { type, tagId, boardId } = req.body;
  const userId = req.user.userId;

  const result = await createChatService(userId, type, tagId, boardId);
  res.status(201).json(result);
});
