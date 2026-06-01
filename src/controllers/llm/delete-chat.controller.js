import asyncHandler from "express-async-handler";
import { deleteChatService } from "../../services/llm/delete-chat.service.js";

export const deleteChatController = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user.userId;

  const result = await deleteChatService(userId, chatId);
  res.status(200).json(result);
});
