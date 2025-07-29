// utils/multer.js or config/multer.js
import multer from "multer";

const storage = multer.memoryStorage(); // stores file in RAM as a buffer

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // optional: 5MB file size limit
});
