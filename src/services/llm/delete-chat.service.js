import { Chat } from "../../models/chat.model.js";
import { AppError } from "../../utils/app.error.js";

export const deleteChatService = async (userId, chatId) => {
  const chat = await Chat.findById(chatId);
  if (!chat) throw new AppError(404, "Chat not found");
  if (chat.userId.toString() !== userId.toString()) {
    throw new AppError(403, "Not authorized");
  }

  await Chat.findOneAndDelete({ _id: chatId });

  return {
    success: true,
    message: "Chat deleted successfully",
  };
};
