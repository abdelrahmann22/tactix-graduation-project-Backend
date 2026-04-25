import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { connectDB } from "./config/db.config.js";
import authRouter from "./routes/auth.router.js";
import profileRouter from "./routes/profile.router.js";
import matchRouter from "./routes/match.router.js";
import TagRouter from "./routes/tag.router.js";
import panelRouter from "./routes/panel.router.js";
import { TacticalBoard } from "./models/tactical-borad.model.js";
import tacticalBoardRouter from "./routes/tactical-board.router.js";
import llmRouter from "./routes/llm.router.js";

dotenv.config();

connectDB();

const app = express();

// Enable CORS for all origins and all HTTP methods
app.use(
  cors({
    origin: "*",
    //credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: "*",
  }),
);

app.use(express.json());

app.use("/health", (req, res) => {
  res.json({
    baseUrl: "https://tactix-graduation-project-backend.vercel.apps",
    health:
      "Our server is in full health but not suitable for our developers health",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/match", matchRouter);
app.use("/api/tag", TagRouter);
app.use("/api/panel", panelRouter);
app.use("/api/board", tacticalBoardRouter);
app.use("/api/llm", llmRouter);
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});
