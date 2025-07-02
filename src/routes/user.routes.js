import { Router } from "express";
import {
  register,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();

router.route("/register").post(register);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(verifyJWT, refreshAccessToken);
router.route("/get-user").get(verifyJWT, getCurrentUser);
router.route("/change-password").patch(verifyJWT, changeCurrentPassword);
router.route("/update-details").patch(verifyJWT, updateAccountDetails);
router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateAvatar);

export default router;
