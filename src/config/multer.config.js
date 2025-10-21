// src/config/multer.config.js
import multer from "multer";
import { AppError } from "../utils/app.error.js";

// Use memory storage (stores file in buffer instead of disk)
const storage = multer.memoryStorage();

// Only accept image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new AppError(400, "Only image files are allowed"));
  }
};

// Export configured Multer instance
export const uploadProfilePicture = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 1,
  },
});
