import express from "express";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { connectDB } from "./config/db.config.js";
import authRouter from "./routes/auth.router.js";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);

app.use(errorHandler);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});
