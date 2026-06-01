import { Chat } from "../../models/chat.model.js";
import { AppError } from "../../utils/app.error.js";

export const getChatsService = async (userId, type) => {
  const filter = { userId };
  if (type) filter.type = type;

  const chats = await Chat.find(filter)
    .sort({ updatedAt: -1 })
    .lean();

  return {
    success: true,
    data: chats,
  };
};
