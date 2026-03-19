import { TacticalBoard } from "../../models/tactical-borad.model.js";
import { AppError } from "../../utils/app.error.js";

export const GetAllUserBoardsService = async (userId) => {
  if (!userId) {
    throw new AppError(403, "user not authenticated");
  }
  const board = await TacticalBoard.find({ userId }).sort({ createdAt: -1 });
  console.log(board);

  if (!board) {
    throw new AppError(404, "tactical board not found");
  }

  return {
    Success: true,
    message: "board retrieved successfully",
    data: board,
  };
};
