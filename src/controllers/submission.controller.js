import Question from "../models/question.model.js";
import Submission from "../models/submission.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { runUserCode } from "../utils/codeRunner.js";

export const generateTestCode = (userCode, functionName, testCases) => {
  let testCode = "";

  testCases.forEach((tc, i) => {
    testCode += `
console.log("TC${i + 1}:" + 
  (JSON.stringify(${functionName}(${tc.input})) === '${
      tc.output
    }' ? "✅" : "❌"));`;
  });

  return `${userCode}\n${testCode}`;
};

const createSubmission = asyncHandler(async (req, res) => {
  const { id: questionId } = req.params;
  const { code, language } = req.body;
  const userId = req.user._id;

  const question = await Question.findById(questionId);
  if (!question) throw new ApiError(404, "Question not found");

  const testCases = question.testCases || [];
  const functionName = question.functionName;

  const codeToExecute = generateTestCode(code, functionName, testCases);

  let result;
  try {
   result = await runUserCode(codeToExecute, language); // { passed, details }
  } catch (err) {
    throw new ApiError(400, "Execution failed: " + err.message);
  }

  const submission = await Submission.create({
    user: userId,
    question: questionId,
    code,
    language,
    status: result.passed ? "passed" : "failed",
    score: result.passed ? 100 : 0,
  });

  res.status(201).json(
    new ApiResponse(
      201,
      {
        submission,
        result: result.details,
      },
      "Submission result"
    )
  );
});

const getSubmissionsByUser = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;

  
  const submissions = await Submission.find({user:userId})

  
  return res
    .status(200)
    .json(new ApiResponse(200, submissions, "User submissions"));
});

const getSubmissionsByQuestion = asyncHandler(async (req, res) => {
  const { id: questionId } = req.params;
  const submissions = await Submission.find({ question: questionId })
    .populate("user", "fullName")
    .sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, submissions, "Question submissions"));
});

const getUserSubmissionsForQuestion = asyncHandler(async (req, res) => {
  const { userId, questionId } = req.params;
  
  const submissions = await Submission.find({
    user: userId,
    question: questionId,
  }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, submissions, "User submissions for this question")
    );
});

export {
  createSubmission,
  getSubmissionsByUser,
  getSubmissionsByQuestion,
  getUserSubmissionsForQuestion,
};
