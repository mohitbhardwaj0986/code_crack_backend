import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./src/routes/user.routes.js";
import questionRouter from "./src/routes/question.routes.js";
import submissionRouter from "./src/routes/submission.routes.js";
import geminiRouter from "./src/routes/gemini.routes.js";
import errorHandler from "./src/middleware/errorHandler.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/question", questionRouter);
app.use("/api/v1/submission", submissionRouter);
app.use("/api/v1/gemini", geminiRouter);

app.use(errorHandler);
export default app;
