import bcrypt from "bcryptjs";
import { User } from "../../models/user.model.js";
import { Token } from "../../models/token.model.js";
import { generateToken, hashToken } from "../../utils/token.util.js";
import { sendEmail } from "../../utils/sendEmail.util.js";

export const registerService = async ({ userName, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already registered");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ userName, email, password: hashedPassword });

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
  await sendEmail(
    email,
    "Verify your account",
    `<p>Hello ${userName}, click <a href="${verifyLink}">here</a> to verify your account.</p>`
  );

  return user;
};
