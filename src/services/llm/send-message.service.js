import { Chat } from "../../models/chat.model.js";
import { Message } from "../../models/message.model.js";
import { Tag } from "../../models/tags.model.js";
import { TacticalBoard } from "../../models/tactical-borad.model.js";
import { aiModel, buildSystemPrompt } from "../../utils/llm.js";
import { AppError } from "../../utils/app.error.js";

const MESSAGE_HISTORY_LIMIT = 20;

async function getClipContext(tagId) {
  const tag = await Tag.findById(tagId).populate("matchId");
  if (!tag) throw new AppError(404, "Tag not found");
  const match = tag.matchId;
  return {
    event: tag.event,
    notes: tag.notes,
    startTime: tag.startTime,
    endTime: tag.endTime,
    matchTitle: match
      ? `${match.teamA} vs ${match.teamB}`
      : "Unknown match",
    teamA: match?.teamA,
    teamB: match?.teamB,
  };
}

async function getBoardContext(boardId) {
  const board = await TacticalBoard.findById(boardId);
  if (!board) throw new AppError(404, "Tactical board not found");
  return {
    name: board.name,
    fieldType: board.fieldType,
    homeTeam: board.homeTeam,
    awayTeam: board.awayTeam,
    scenes: board.scenes,
  };
}

export const sendMessageService = async (userId, chatId, content) => {
  const chat = await Chat.findById(chatId);
  if (!chat) throw new AppError(404, "Chat not found");
  if (chat.userId.toString() !== userId.toString()) {
    throw new AppError(403, "Not authorized");
  }

  if (!content) throw new AppError(400, "Message content is required");

  await Message.create({ chatId, role: "user", content });

  const recentMessages = await Message.find({ chatId })
    .sort({ createdAt: -1 })
    .limit(MESSAGE_HISTORY_LIMIT)
    .lean();

  recentMessages.reverse();

  let systemContent;
  if (chat.type === "clip") {
    const context = await getClipContext(chat.tagId);
    systemContent = buildSystemPrompt("clip", context);
  } else if (chat.type === "board") {
    const context = await getBoardContext(chat.boardId);
    systemContent = buildSystemPrompt("board", context);
  } else {
    systemContent = buildSystemPrompt("general");
  }

  const llmMessages = [
    { role: "system", content: systemContent },
    ...recentMessages.map((m) => ({ role: m.role, content: m.content })),
  ];

  const assistantContent = await aiModel(llmMessages);

  const assistantMessage = await Message.create({
    chatId,
    role: "assistant",
    content: assistantContent,
  });

  return {
    success: true,
    message: "Message sent successfully",
    data: assistantMessage,
  };
};
