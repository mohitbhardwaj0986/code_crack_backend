import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createSubmission } from "../controllers/submission.controller.js";
import { getSubmissionsByUser } from "../controllers/submission.controller.js";
import { getSubmissionsByQuestion } from "../controllers/submission.controller.js";
import { getUserSubmissionsForQuestion } from "../controllers/submission.controller.js";

const router = Router();
router.route("/create/:id").post(verifyJWT, createSubmission);
router.route("/getsubmission-user/:id").get(verifyJWT, getSubmissionsByUser);
router
  .route("/getsubmission-question/:id")
  .get(verifyJWT, getSubmissionsByQuestion);
router
  .route("/get-user-submission-question/:userId/:questionId")
  .get(verifyJWT, getUserSubmissionsForQuestion);
export default router;
