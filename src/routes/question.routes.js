import { Router } from "express";
import {
  createQuestion,
  updateQuestion,
  deleteQuesiton,
  getAllQuestions,
  getSingleQuestion,
} from "../controllers/question.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();

router.route("/create").post(verifyJWT, createQuestion);
router.route("/update/:id").patch(verifyJWT, updateQuestion);
router.route("/delete/:id").delete(verifyJWT, deleteQuesiton);
router.route("/get-all").get(verifyJWT, getAllQuestions);
router.route("/get-single/:id").get(verifyJWT, getSingleQuestion);

export default router;
