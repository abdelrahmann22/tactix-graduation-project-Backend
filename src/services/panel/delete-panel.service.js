import { Panel } from "../../models/panel.model.js";
import { AppError } from "../../utils/app.error.js";

export const DeletePanelService = async (userId, panelId) => {
  if (!userId || !panelId) {
    throw new AppError(400, "User ID and Panel ID are required");
  }

  const panel = await Panel.findOne({ _id: panelId, userId });

  if (!panel) {
    throw new AppError(404, "Panel not found or access denied");
  }

  await Panel.findByIdAndDelete(panelId);

  return {
    success: true,
    message: "Panel deleted successfully",
  };
};
