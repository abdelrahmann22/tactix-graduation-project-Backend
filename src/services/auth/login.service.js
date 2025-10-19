import bcrypt from "bcryptjs";
import { User } from "../../models/user.model.js";
import { signJwt } from "../../utils/jwt.util.js";
import { CustomError } from "../../utils/customError.util.js";

export const loginService = async ({ email, password }) => {
  // Validate inputs
  if (!email || !password) {
    throw new CustomError("Email and password are required", 400);
  }

  try {
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new CustomError("Invalid email or password", 401);
    }

    // Check if email is verified
    if (!user.isVerified) {
      throw new CustomError("Please verify your email before logging in", 403);
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new CustomError("Invalid email or password", 401);
    }

    // Generate JWT token
    const token = signJwt({
      userId: user._id,
      email: user.email,
      userName: user.userName,
    });

    return {
      token,
      user,
    };
  } catch (error) {
    // If it's already a CustomError, rethrow it
    if (error instanceof CustomError) {
      throw error;
    }

    throw new CustomError(error.message || "Login failed", 500);
  }
};