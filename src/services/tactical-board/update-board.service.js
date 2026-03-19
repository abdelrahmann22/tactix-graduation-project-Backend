import { TacticalBoard } from "../../models/tactical-borad.model.js";
import { AppError } from "../../utils/app.error.js";

export const UpdateBoardService = async (userId, boardId, updatedData) => {
  if (!userId) {
    throw new AppError(403, "user not authenticated");
  }

  const board = await TacticalBoard.findOneAndUpdate(
    { _id: boardId, userId },
    updatedData,
    { new: true },
  );

  if (!board) {
    throw new AppError(404, "tactical board not found");
  }

  return {
    success: true,
    message: "board updated successfully",
    data: board,
  };
};
