import { Panel } from "../../models/panel.model.js";
import { AppError } from "../../utils/app.error.js";

export const GetUserPanelsService = async (userId) => {
  if (!userId) {
    throw new AppError(400, "user Id is missed");
  }
  const panels = await Panel.find({ userId }).sort({ createdAt: -1 });

  return {
    Success: true,
    message: "Panel retrieved successfully",
    data: panels,
  };
};
