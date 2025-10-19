import express from "express";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { connectDB } from "./config/db.config.js";
import authRouter from "./routes/auth.router.js";
const app = express();

connectDB();

app.use(express.json());

app.use("/api/auth", authRouter);

app.use(errorHandler);
app.listen(80, () => {
  console.log("Server is running on port 80");
});
