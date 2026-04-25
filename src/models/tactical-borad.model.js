import mongoose from "mongoose";
import { nanoid } from "nanoid";
const tacticalBoardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tagId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tag",
  },
  name: {
    type: String,
    required: true,
  },
  scenes: [
    {
      type: mongoose.Schema.Types.Mixed,
    },
  ],
  homeTeam: {
    name: String,
    primaryColor: String,
    secondaryColor: String,
    textColor: String,
  },
  awayTeam: {
    name: String,
    primaryColor: String,
    secondaryColor: String,
    textColor: String,
  },
  fieldType: {
    type: String,
    enum: ["full", "half", "third", "penalty-area"],
    default: "full",
  },
  fieldRotation: {
    type: Number,
    enum: [0, 90, 180, 270],
    default: 0,
  },
});

// force generating id per each scene
tacticalBoardSchema.pre("save", function (next) {
  if (this.scenes && Array.isArray(this.scenes)) {
    this.scenes = this.scenes.map((scene) => ({
      ...scene,
      id: scene.id || nanoid(),
    }));
  }
  next();
});

tacticalBoardSchema.pre("findOneAndUpdate", function (next) {
  let update = this.getUpdate();

  // handle $set case
  if (update.$set && update.$set.scenes) {
    update.$set.scenes = update.$set.scenes.map((scene) => ({
      ...scene,
      id: scene.id || nanoid(),
    }));
  }

  // handle direct case
  if (update.scenes) {
    update.scenes = update.scenes.map((scene) => ({
      ...scene,
      id: scene.id || nanoid(),
    }));
  }

  this.setUpdate(update);
  next();
});

export const TacticalBoard = mongoose.model(
  "Tactical-Board",
  tacticalBoardSchema,
);
