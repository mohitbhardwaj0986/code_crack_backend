import {Router} from 'express'
import { interview, questionSubmissionAiChat, resumeReviewer } from '../controllers/gemini.controller.js'
import {verifyJWT} from "../middleware/auth.middleware.js"
import {upload} from '../middleware/multer.middleware.js'
const router = Router()

router.route("/chat").post(verifyJWT, questionSubmissionAiChat)
router.route("/interview").post(verifyJWT, interview)
router.route("/resume").post(verifyJWT, upload.single("file") ,resumeReviewer)

export default router