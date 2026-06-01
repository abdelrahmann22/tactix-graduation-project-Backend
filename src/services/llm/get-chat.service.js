import { Chat } from "../../models/chat.model.js";
import { Message } from "../../models/message.model.js";
import { AppError } from "../../utils/app.error.js";

const DEFAULT_PAGE_SIZE = 50;

export const getChatService = async (userId, chatId, page = 1, limit = DEFAULT_PAGE_SIZE) => {
  const chat = await Chat.findById(chatId).lean();
  if (!chat) throw new AppError(404, "Chat not found");
  if (chat.userId.toString() !== userId.toString()) {
    throw new AppError(403, "Not authorized");
  }

  const skip = (page - 1) * limit;
  const [messages, total] = await Promise.all([
    Message.find({ chatId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Message.countDocuments({ chatId }),
  ]);

  return {
    success: true,
    data: {
      chat,
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  };
};
