import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createChatController } from "../controllers/llm/create-chat.controller.js";
import { sendMessageController } from "../controllers/llm/send-message.controller.js";
import { getChatsController } from "../controllers/llm/get-chats.controller.js";
import { getChatController } from "../controllers/llm/get-chat.controller.js";
import { deleteChatController } from "../controllers/llm/delete-chat.controller.js";

const llmRouter = express.Router();

llmRouter.use(authMiddleware);

llmRouter.post("/chat", createChatController);
llmRouter.get("/chat", getChatsController);
llmRouter.get("/chat/:chatId", getChatController);
llmRouter.post("/chat/:chatId/message", sendMessageController);
llmRouter.delete("/chat/:chatId", deleteChatController);

export default llmRouter;
