import bcrypt from "bcryptjs";
import { User } from "../../models/user.model.js";
import { signJwt } from "../../utils/jwt.util.js";
import { AppError } from "../../utils/app.error.js";
import { z } from "zod";
const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid Email Format"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters long"),
});

export const loginService = async ({ email, password }) => {
  const parsedResult = loginSchema.safeParse({ email, password });
  console.log("Parsed Result:", parsedResult);

  if (!parsedResult.success) {
    const errorMesssage = parsedResult.error.issues
      .map((e) => e.message)
      .join(",");

    throw new AppError(400, `Invalid input :${errorMesssage}`);
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
