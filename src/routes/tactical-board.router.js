import { CreateBoardController } from "../controllers/tactical-board/create-board.controller.js";
import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { GetAllUserBoardsController } from "../controllers/tactical-board/get-user-boards.controller.js";
import { GetBoardByIdController } from "../controllers/tactical-board/get-board-by-id.controller.js";
import { DeleteBoardByIdController } from "../controllers/tactical-board/delete-board.controller.js";
import { DeleteSceneFromBoardController } from "../controllers/tactical-board/delete-scene.controller.js";
import { UpdateBoardController } from "../controllers/tactical-board/update-board.controller.js";

const tacticalBoardRouter = express.Router();

tacticalBoardRouter.use(authMiddleware);

tacticalBoardRouter.post("/", CreateBoardController);
tacticalBoardRouter.get("/", GetAllUserBoardsController);
tacticalBoardRouter.get("/:boardId", GetBoardByIdController);
tacticalBoardRouter.delete("/:boardId", DeleteBoardByIdController);
tacticalBoardRouter.patch("/:boardId", UpdateBoardController);
tacticalBoardRouter.delete(
  "/:boardId/:sceneId",
  DeleteSceneFromBoardController,
);
export default tacticalBoardRouter;
