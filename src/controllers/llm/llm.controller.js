import asyncHandler from "express-async-handler";
import { aiModel } from "../../utils/llm.js";

export const llmController = asyncHandler(async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: "prompt is required" });
  }

  const result = await aiModel(prompt);

  res.status(200).json({ result });
});
