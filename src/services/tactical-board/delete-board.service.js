import { TacticalBoard } from "../../models/tactical-borad.model.js";
import { AppError } from "../../utils/app.error.js";

export const DeleteBoardByIdService = async (userId, boardId) => {
  if (!userId) {
    throw new AppError(403, "user isn't authenticated");
  }
  if (!boardId) {
    throw new AppError(400, "board id isn't provided");
  }
  const result = await TacticalBoard.deleteOne({ userId, _id: boardId });

  if (result.deletedCount === 0) {
    throw new AppError(404, "board isn't found or access denied");
  }
  return {
    success: true,
    message: "board deleted successfully",
  };
};
