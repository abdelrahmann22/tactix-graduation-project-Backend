import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tokenHash: { type: String, required: true },
    type: { type: String, enum: ["verify", "reset"], required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Token = mongoose.model("Token", tokenSchema);
