import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/profile/userProfile.controller.js";

const profileRouter = express.Router();

profileRouter.get("/", authMiddleware, getUserProfile);
profileRouter.put("/", authMiddleware, updateUserProfile);

export default profileRouter;
