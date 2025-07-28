import {Router} from 'express'
import { questionSubmissionAiChat } from '../controllers/gemini.controller.js'
import {verifyJWT} from "../middleware/auth.middleware.js"
const router = Router()

router.route("chat").post(verifyJWT, questionSubmissionAiChat)

export default router