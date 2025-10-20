import bcrypt from "bcryptjs";
import { User } from "../../models/user.model.js";
import { Token } from "../../models/token.model.js";
import { generateToken, hashToken } from "../../utils/token.util.js";
import { sendEmail, sendEmailUsingResend } from "../../utils/sendEmail.util.js";
import { CustomError } from "../../utils/customError.util.js";
import { verifyEmailTemplate } from "../../utils/emailTemplates/verfiyEmailTemplate.js";
export const registerService = async ({ userName, email, password }) => {
  // Validate inputs
  if (!userName || !email || !password) {
    throw new CustomError("All fields are required", 400);
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new CustomError("Email already registered", 409);
  }

  if (password.length < 6) {
    throw new CustomError("Password must be at least 6 characters", 400);
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
    });

    const rawToken = generateToken(20);
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    await Token.create({
      userId: user._id,
      tokenHash,
      type: "verify",
      expiresAt,
    });

    const verifyLink = `${process.env.APP_BASE_URL}/api/auth/verify?token=${rawToken}&id=${user._id}`;

    const basicHTML = `<p>Hello ${userName}, click <a href="${verifyLink}">here</a> to verify your account.</p>`;

    const htmlContent = verifyEmailTemplate(userName, verifyLink);

    await sendEmail(email, "Verify your account", htmlContent);
    //await sendEmailUsingResend(email, "Verify your account", htmlContent);
    return user;
  } catch (error) {
    // If it's already a CustomError, rethrow it
    if (error instanceof CustomError) {
      throw error;
    }

    // Handle database errors
    if (error.code === 11000) {
      throw new CustomError("Email already exists", 409);
    }

    // Handle email sending errors
    if (error.message.includes("SMTP")) {
      throw new CustomError(
        "Failed to send verification email. Please try again later.",
        500
      );
    }

    throw new CustomError(error.message || "Registration failed", 500);
  }
};
