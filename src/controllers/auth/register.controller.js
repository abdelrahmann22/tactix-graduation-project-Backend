import { registerService } from "../../services/auth/register.service.js";
import asyncHandler from "express-async-handler";
export const registerController = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;
  await registerService({ userName, email, password, filePath: req.file });
  res.status(201).json({
    message:
      "Registration successful. Check your email to verify your account.",
  });
});
