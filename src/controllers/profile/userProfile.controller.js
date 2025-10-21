import asyncHandler from "express-async-handler";
import {
  getUserProfileService,
  updateUserProfileService,
} from "../../services/profile/userProfile.service.js";

export const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const user = await getUserProfileService(userId);

  res.status(200).json({
    id: user._id,
    username: user.userName,
    profileImageUrl: user.profileImageUrl,
  });
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const data = req.body;

  const user = await updateUserProfileService(userId, data);

  res.status(200).json({
    message: "Data edited successfully",
    data: user,
  });
});
