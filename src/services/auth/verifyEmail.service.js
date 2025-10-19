import { hashToken } from "../../utils/token.util.js";
import { Token } from "../../models/token.model.js";
import { User } from "../../models/user.model.js";

export const verifyEmailService = async ({ userId, token }) => {
  if (!userId || !token) {
    throw new Error("Missing token or user id");
  }

  const tokenHash = hashToken(token);

  const tokenDoc = await Token.findOne({
    userId,
    tokenHash,
    type: "verify",
  });

  if (!tokenDoc) {
    throw new Error("Invalid or expired verification token");
  }

  // Mark user as verified
  const user = await User.findById(userId);
  if (!user) {
    // cleanup token(s) if user doesn't exist
    await Token.deleteMany({ userId, type: "verify" });
    throw new Error("User not found");
  }

  if (user.isVerified) {
    // already verified — remove token(s) and return silently or throw depending on your policy
    await Token.deleteMany({ userId, type: "verify" });
    return user;
  }

  user.isVerified = true;
  await user.save();

  // Remove any verification tokens for this user (single-use)
  await Token.deleteMany({ userId, type: "verify" });

  return user;
};
