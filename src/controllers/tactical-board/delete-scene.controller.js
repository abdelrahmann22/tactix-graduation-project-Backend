import asyncHandler from "express-async-handler";
import { DeleteSceneFromBoardService } from "../../services/tactical-board/delete-scene.service.js";
export const DeleteSceneFromBoardController = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const boardId = req.params.boardId;
  const sceneId = req.params.sceneId;
  const result = await DeleteSceneFromBoardService(userId, boardId, sceneId);

  res.status(200).json(result);
});
