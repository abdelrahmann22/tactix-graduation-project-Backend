import bcrypt from "bcryptjs";
import { User } from "../../models/user.model.js";
import { signJwt } from "../../utils/jwt.util.js";
import { AppError } from "../../utils/app.error.js";

export const loginService = async ({ email, password }) => {
  // Validate inputs
  if (!email || !password) {
    throw new AppError(400, "Email and password are required");
  }

  try {
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    // Check if email is verified
    if (!user.isVerified) {
      throw new AppError(403, "Please verify your email before logging in");
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, "Invalid email or password");
    }

    // Generate JWT token
    const token = signJwt({
      userId: user._id,
      email: user.email,
      userName: user.userName,
      isVerified: user.isVerified,
    });

    return {
      token,
      user,
    };
  } catch (error) {
    // If it's already a AppError, rethrow it
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(500, error.message || "Login failed");
  }
};
