import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createTagController } from "../controllers/tag/create-tag.controller.js";
import { deleteTagController } from "../controllers/tag/delete-tag.controller.js";
import { updateTagController } from "../controllers/tag/update-tag.controller.js";
import { sendPreSignedURLToClientController } from "../controllers/tag/send-upload-url.controller.js";
import { VerifiyTagUploadController } from "../controllers/tag/verify-upload.controller.js";
const TagRouter = express.Router();

TagRouter.use(authMiddleware);

TagRouter.post("/:matchId", createTagController);
TagRouter.delete("/:tagId", deleteTagController);
TagRouter.put("/:tagId", updateTagController);
TagRouter.post("/:tagId/upload-url", sendPreSignedURLToClientController);
TagRouter.post("/:tagId/verify-upload", VerifiyTagUploadController);

export default TagRouter;
