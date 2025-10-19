import { hashToken } from "../../utils/token.util.js";
import { Token } from "../../models/token.model.js";
import { User } from "../../models/user.model.js";
import { CustomError } from "../../utils/customError.util.js";

export const verifyEmailService = async ({ userId, token }) => {
  // Validate inputs
  if (!userId || !token) {
    throw new CustomError("Missing token or user id", 400);
  }

  try {
    const tokenHash = hashToken(token);

    const tokenDoc = await Token.findOne({
      userId,
      tokenHash,
      type: "verify",
    });

    if (!tokenDoc) {
      throw new CustomError("Invalid or expired verification token", 401);
    }

    // Mark user as verified
    const user = await User.findById(userId);
    if (!user) {
      // cleanup token(s) if user doesn't exist
      await Token.deleteMany({ userId, type: "verify" });
      throw new CustomError("User not found", 404);
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
    // If it's already a CustomError, rethrow it
    if (error instanceof CustomError) {
      throw error;
    }

    throw new CustomError(error.message || "Email verification failed", 500);
  }
};