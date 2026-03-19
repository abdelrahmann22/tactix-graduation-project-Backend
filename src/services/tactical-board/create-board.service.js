import { TacticalBoard } from "../../models/tactical-borad.model.js";
import { AppError } from "../../utils/app.error.js";

export const CreateBoardService = async (userId, data) => {
  if (!userId) {
    throw new AppError(403, "User not authenticated");
  }
  if (!data) {
    throw new AppError(400, "Board data is missing");
  }

  const boardData = { ...data, userId };

  const board = await TacticalBoard.create(boardData);

  return {
    success: true,
    message: "Board Created successfully",
    data: board,
  };
};
