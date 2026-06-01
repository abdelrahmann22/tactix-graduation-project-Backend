import asyncHandler from "express-async-handler";
import { sendMessageService } from "../../services/llm/send-message.service.js";

export const sendMessageController = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { content } = req.body;
  const userId = req.user.userId;

  const result = await sendMessageService(userId, chatId, content);
  res.status(200).json(result);
});
