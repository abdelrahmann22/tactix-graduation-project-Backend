import asyncHandler from "express-async-handler";
import { getChatService } from "../../services/llm/get-chat.service.js";

export const getChatController = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { page, limit } = req.query;
  const userId = req.user.userId;

  const result = await getChatService(
    userId,
    chatId,
    page ? parseInt(page) : 1,
    limit ? parseInt(limit) : 50,
  );
  res.status(200).json(result);
});
