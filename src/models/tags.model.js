import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },
    startTime: {
      type: Number,
      required: true,
    },
    endTime: {
      type: Number,
      required: true,
    },
    event: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    clipKey: {
      type: String,
    },
    clipURL: {
      type: String, // URL from cloud provider when clip is exported
    },
  },
  { timestamps: true },
);

export const Tag = mongoose.model("Tag", tagSchema);
