import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    profileImageUrl: {
      type: String,
      default: "https://i.sstatic.net/l60Hf.png",
    },
  },
  { timestamps: true },
);

// cascade deleting
userSchema.pre("findOneAndDelete", async function (next) {
  const user = await this.model.findOne(this.getFilter());

  if (user) {
    await mongoose.model("Panel").deleteMany({
      userId: user._id,
    });

    await mongoose.model("Match").deleteMany({
      userId: user._id,
    });

    await mongoose.model("Chat").deleteMany({
      userId: user._id,
    });
  }

  next();
});
export const User = mongoose.model("User", userSchema);
