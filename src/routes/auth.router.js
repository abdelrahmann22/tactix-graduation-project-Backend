import express from "express";
import { registerController } from "../controllers/auth/register.controller.js";
import { verifyEmailController } from "../controllers/auth/verifyEmail.controller.js";

const authRouter = express.Router();

authRouter.post("/register", registerController);
authRouter.get("/verify", verifyEmailController);

export default authRouter;
