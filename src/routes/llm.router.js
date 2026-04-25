import Router from "express";
import { llmController } from "../controllers/llm/llm.controller.js";

const llmRouter = Router();

llmRouter.post("/", llmController);

export default llmRouter;
