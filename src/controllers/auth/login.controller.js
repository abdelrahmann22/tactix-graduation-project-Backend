import { loginService } from "../../services/auth/login.service.js";
import asyncHandler from "express-async-handler";

export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await loginService({ email, password });

  res.status(200).json({
    message: "Login successful",
    token: result.token,
    user: {
      id: result.user._id,
      userName: result.user.userName,
      email: result.user.email,
      isVerified: result.user.isVerified,
    },
  });
});
