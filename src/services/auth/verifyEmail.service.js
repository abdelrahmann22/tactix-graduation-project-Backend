import { hashToken } from "../../utils/token.util.js";
import { Token } from "../../models/token.model.js";
import { User } from "../../models/user.model.js";
import { AppError } from "../../utils/app.error.js";

export const verifyEmailService = async ({ userId, token }) => {
  // Validate inputs
  if (!userId || !token) {
    throw new AppError(400, "Missing token or user id");
  }

  try {
    const tokenHash = hashToken(token);

    const tokenDoc = await Token.findOne({
      userId,
      tokenHash,
      type: "verify",
    });

    if (!tokenDoc) {
      throw new AppError(401, "Invalid or expired verification token");
    }

    // Mark user as verified
    const user = await User.findById(userId);
    if (!user) {
      // cleanup token(s) if user doesn't exist
      await Token.deleteMany({ userId, type: "verify" });
      throw new AppError(404, "User not found");
    }

    if (user.isVerified) {
      // already verified — remove tokens
      await Token.deleteMany({ userId, type: "verify" });
      return user;
    }

    user.isVerified = true;
    await user.save();

    // Remove any verification tokens for this user (single-use)
    await Token.deleteMany({ userId, type: "verify" });

    return user;
  } catch (error) {
    // If it's already a AppError, rethrow it
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(500, error.message || "Email verification failed");
  }
};
