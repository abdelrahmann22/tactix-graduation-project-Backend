import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createTagController } from "../controllers/tag/create-tag.controller.js";
import { deleteTagController } from "../controllers/tag/delete-tag.controller.js";
import { updateTagController } from "../controllers/tag/update-tag.controller.js";
import { sendPreSignedURLToClientController } from "../controllers/tag/send-upload-url.controller.js";
import { VerifiyTagUploadController } from "../controllers/tag/verify-upload.controller.js";
import { LinkTagToNewTacticalBoardController } from "../controllers/tag/link-tacticalborad-to-tag.controller.js";
import { GetTagBoardController } from "../controllers/tag/get-tag-board.controller.js";
const TagRouter = express.Router();

TagRouter.use(authMiddleware);

TagRouter.post("/:tagId/link", LinkTagToNewTacticalBoardController);
TagRouter.post("/:tagId/upload-url", sendPreSignedURLToClientController);
TagRouter.post("/:tagId/verify-upload", VerifiyTagUploadController);
TagRouter.get("/:tagId/board", GetTagBoardController);

TagRouter.delete("/:tagId", deleteTagController);
TagRouter.put("/:tagId", updateTagController);

TagRouter.post("/:matchId", createTagController);

export default TagRouter;
