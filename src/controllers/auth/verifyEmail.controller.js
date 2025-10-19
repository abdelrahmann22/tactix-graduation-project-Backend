import asyncHandler from "express-async-handler";
import { verifyEmailService } from "../../services/auth/verifyEmail.service.js";

export const verifyEmailController = asyncHandler(async (req, res) => {
  const { token, id } = req.query;
  await verifyEmailService({ userId: id, token });
  res.json({ message: "Email verified successfully." });
});
