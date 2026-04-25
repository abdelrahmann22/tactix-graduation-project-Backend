import { Tag } from "../../models/tags.model.js";
import { TacticalBoard } from "../../models/tactical-borad.model.js";
import { AppError } from "../../utils/app.error.js";

export const LinkTagToNewTacticalBoardService = async (tagId, userId) => {
  try {
    const tag = await Tag.findById(tagId).populate("matchId");
    if (!tag) throw new AppError(404, "tag not found");

    if (tag.matchId.userId.toString() !== userId.toString())
      throw new AppError(403, "you are not authorized");

    const existingBoard = await TacticalBoard.find({ tagId: tagId });
    if (existingBoard) {
      throw new AppError(404, "tactical board already exists");
    }

    const tacticalBoard = await TacticalBoard.create({
      userId: userId,
      tagId: tagId,
      name: `${tagId} board`,
    });

    return {
      success: true,
      message: "Tag Linked To a new tactical board successfully Successfully",
      data: tacticalBoard,
    };
  } catch (err) {
    console.log(err);
    throw new AppError(500, err || "Error in Linking tag to a tactical board");
  }
};
