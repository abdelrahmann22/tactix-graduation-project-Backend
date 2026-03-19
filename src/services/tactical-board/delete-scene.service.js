import { TacticalBoard } from "../../models/tactical-borad.model.js";
import { AppError } from "../../utils/app.error.js";

export const DeleteSceneFromBoardService = async (userId, boardId, sceneId) => {
  if (!userId) {
    throw new AppError(403, "user isn't authenticated");
  }
  if (!boardId) {
    throw new AppError(400, "board id isn't provided");
  }
  const result = await TacticalBoard.updateOne(
    { userId, _id: boardId },
    { $pull: { scenes: { id: sceneId } } },
  );

  if (result.modifiedCount === 0) {
    throw new AppError(404, "scene isn't found or access denied");
  }
  return {
    success: true,
    message: "scene deleted successfully",
  };
};
