import crypto from "crypto";

export const generateToken = (length = 32) =>
  crypto.randomBytes(length).toString("hex");

export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");
