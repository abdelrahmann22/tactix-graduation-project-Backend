import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["general", "clip", "board"],
      required: true,
    },
    tagId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tactical-Board",
    },
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

chatSchema.pre("findOneAndDelete", async function (next) {
  const chat = await this.model.findOne(this.getFilter());
  if (chat) {
    await mongoose.model("Message").deleteMany({ chatId: chat._id });
  }
  next();
});

export const Chat = mongoose.model("Chat", chatSchema);
