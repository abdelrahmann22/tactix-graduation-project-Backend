import { Panel } from "../../models/panel.model.js";
import { AppError } from "../../utils/app.error.js";

export const CreatePanelService = async (userId, title, tags) => {
  if (!userId) {
    throw new AppError(400, "user Id is missed");
  }
  if (!title) {
    throw new AppError(400, "Please provide a title");
  }
  if (!tags || tags.lenght == 0) {
    throw new AppError(400, "Please provide a valid tags they may be empty");
  }

  const panel = await Panel.create({ userId, title, tags });

  return {
    Success: true,
    message: "Panel Created successfully",
    data: panel,
  };
};
