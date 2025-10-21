import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    profileImageUrl: {
      type: String,
      default: "https://i.sstatic.net/l60Hf.png",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
