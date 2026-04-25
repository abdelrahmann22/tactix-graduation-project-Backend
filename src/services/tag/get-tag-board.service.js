import { Tag } from "../../models/tags.model.js";
import { TacticalBoard } from "../../models/tactical-borad.model.js";
import { AppError } from "../../utils/app.error.js";

export const GetTagBoardService = async (tagId, userId) => {
  try {
    const tag = await Tag.findById(tagId).populate("matchId");
    if (!tag) throw new AppError(404, "tag not found");

    if (tag.matchId.userId.toString() !== userId.toString())
      throw new AppError(403, "you are not authorized");

    const existingBoard = await TacticalBoard.find({ tagId: tagId });
    return {
      success: true,
      message:
        existingBoard.length > 0
          ? "Board retrieved successfully"
          : "No board found for this tag",
      data: existingBoard, // ممكن تكون [] وده طبيعي
    };
  } catch (err) {
    console.log(err);
    throw new AppError(
      500,
      err || "Error in retreiving tactical's board to a tactical board",
    );
  }
};
