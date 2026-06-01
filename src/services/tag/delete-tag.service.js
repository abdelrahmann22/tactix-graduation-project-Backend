import { Tag } from "../../models/tags.model.js";
import { AppError } from "../../utils/app.error.js";
import { Match } from "../../models/match.model.js";
import { Chat } from "../../models/chat.model.js";
import { redis } from "../../config/redis.config.js";
export const deleteTagService = async (tagId, userId) => {
  try {
    const tag = await Tag.findById(tagId).populate("matchId");
    if (!tag) throw new AppError(404, "tag not found");

    if (tag.matchId.userId.toString() !== userId.toString())
      throw new AppError(403, "you are not authorized");

    await Match.findByIdAndUpdate(tag.matchId, {
      $pull: { tags: tagId },
    });

    await Tag.deleteOne({ _id: tagId });

    await Chat.deleteMany({ type: "clip", tagId });

    // invalidate cached match
    await redis.del(`match:${tag.matchId._id}`);

    return {
      success: true,
      message: "Tag Deleted Successfully",
    };
  } catch (err) {
    console.log(err);
    throw new AppError(500, err.message || "error in deleting Tag");
  }
};
