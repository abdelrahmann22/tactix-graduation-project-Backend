import express from "express";
import { registerController } from "../controllers/auth/register.controller.js";
import { verifyEmailController } from "../controllers/auth/verifyEmail.controller.js";
import { loginController } from "../controllers/auth/login.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateLogin, validateRegister } from "../middlewares/validate.middleware.js";

const authRouter = express.Router();

// Public routes
authRouter.post("/register", validateRegister, registerController);
authRouter.get("/verify", verifyEmailController);
authRouter.post("/login", validateLogin, loginController);

// Protected routes
authRouter.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "This is a protected route",
    user: req.user,
  });
});

export default authRouter;