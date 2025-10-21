import bcrypt from "bcryptjs";
import { User } from "../../models/user.model.js";
import { Token } from "../../models/token.model.js";
import { generateToken, hashToken } from "../../utils/token.util.js";
import { sendEmail } from "../../utils/sendEmail.util.js";
import { AppError } from "../../utils/app.error.js";
import { verifyEmailTemplate } from "../../utils/emailTemplates/verfiyEmailTemplate.js";
import { uploadToCloudinary } from "../../config/profile-pic.cloudinary.config.js";
export const registerService = async ({
  userName,
  email,
  password,
  filePath,
}) => {
  // Validate inputs
  if (!userName || !email || !password) {
    throw new AppError(400, "All fields are required");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError(409, "Email already registered");
  }

  if (password.length < 6) {
    throw new AppError(400, "Password must be at least 6 characters");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    let profileImageUrl = null;
    if (filePath?.buffer) {
      const profilePic = await uploadToCloudinary(filePath.buffer);
      if (profilePic.success) {
        profileImageUrl = profilePic.url;
      }
    }

    const user = await User.create({
      userName,

      email,
      password: hashedPassword,
      ...(profileImageUrl && { profileImageUrl }),
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
    // If it's already a AppError, rethrow it
    if (error instanceof AppError) {
      throw error;
    }

    // Handle database errors
    if (error.code === 11000) {
      throw new AppError(409, "Email already exists");
    }

    // Handle email sending errors
    if (error.message.includes("SMTP")) {
      throw new AppError(
        500,
        "Failed to send verification email. Please try again later."
      );
    }

    throw new AppError(500, error.message || "Registration failed");
  }
};
