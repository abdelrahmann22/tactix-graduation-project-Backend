import { TacticalBoard } from "../../models/tactical-borad.model.js";
import { AppError } from "../../utils/app.error.js";

export const GetBoardByIdService = async (userId, boardId) => {
  if (!userId) {
    throw new AppError(403, "user isn't authenticated");
  }
  if (!boardId) {
    throw new AppError(404, "board id isn't provided");
  }
  const baord = await TacticalBoard.find({ userId, _id: boardId });

  if (!baord) {
    throw new AppError(404, "board isn't found or access denied");
  }
  return {
    success: true,
    message: "board retrieved successfully",
    data: baord,
  };
};
