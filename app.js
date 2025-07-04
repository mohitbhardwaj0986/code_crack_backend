import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./src/routes/user.routes.js";
import questionRouter from "./src/routes/question.routes.js";
import submissionRouter from "./src/routes/submission.routes.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/question", questionRouter);
app.use("/api/v1/submission", submissionRouter);

export default app;
