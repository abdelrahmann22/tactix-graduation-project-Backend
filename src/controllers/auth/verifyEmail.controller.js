import asyncHandler from "express-async-handler";
import { verifyEmailService } from "../../services/auth/verifyEmail.service.js";
import dotenv from "dotenv";

dotenv.config();
export const verifyEmailController = asyncHandler(async (req, res) => {
  const { token, id } = req.query;
  // await verifyEmailService({ userId: id, token });
  // res.json({ message: "Email verified successfully." });

  try {
    await verifyEmailService({ userId: id, token });
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/email-verification/success`
    );
  } catch (error) {
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/email-verification/failed`
    );
  }
});
