import { Chat } from "../../models/chat.model.js";
import { Tag } from "../../models/tags.model.js";
import { TacticalBoard } from "../../models/tactical-borad.model.js";
import { AppError } from "../../utils/app.error.js";

export const createChatService = async (userId, type, tagId, boardId) => {
  if (type === "clip" && !tagId) {
    throw new AppError(400, "tagId is required for clip chats");
  }
  if (type === "board" && !boardId) {
    throw new AppError(400, "boardId is required for board chats");
  }

  let title = "New Chat";

  if (type === "clip") {
    const tag = await Tag.findById(tagId).populate("matchId");
    if (!tag) throw new AppError(404, "Tag not found");
    if (tag.matchId.userId.toString() !== userId.toString()) {
      throw new AppError(403, "Not authorized to access this tag");
    }
    const match = tag.matchId;
    title = `Clip: ${match.teamA} vs ${match.teamB} — ${tag.event}`;
  }

  if (type === "board") {
    const board = await TacticalBoard.findById(boardId);
    if (!board) throw new AppError(404, "Tactical board not found");
    if (board.userId.toString() !== userId.toString()) {
      throw new AppError(403, "Not authorized to access this board");
    }
    title = `Board: ${board.name}`;
  }

  const chat = await Chat.create({
    userId,
    type,
    tagId: type === "clip" ? tagId : undefined,
    boardId: type === "board" ? boardId : undefined,
    title,
  });

  return {
    success: true,
    message: "Chat created successfully",
    data: chat,
  };
};
