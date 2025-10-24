import { AppError } from "../../utils/app.error.js";
import { User } from "../../models/user.model.js";

export const getUserProfileService = async (userId) => {
  if (!userId) throw new AppError(400, "User Id is required");
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, "User not found");

  return user;
};

export const updateUserProfileService = async (userId, data) => {
  try {
    if (!userId) throw new AppError(400, "User Id is required");
    if (!data || Object.keys(data).length === 0)
      throw new AppError(400, "There's nothing to change");

    const { userName, profileImageUrl } = data;

    const updateData = {};
    if (userName !== undefined) updateData.userName = userName;
    if (profileImageUrl !== undefined)
      updateData.profileImageUrl = profileImageUrl;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) throw new AppError(404, "User not found");

    return user;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(500, "Failed to update profile");
  }
};
