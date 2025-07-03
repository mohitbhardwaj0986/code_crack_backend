import Question from "../models/question.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createQuestion = asyncHandler(async (req, res) => {
  const userRole = req.user.role;
  if (userRole !== "admin") {
    throw new ApiError(401, "Not authorized");
  }

  const { title, description, difficulty, tags, testCases } = req.body;
  if (
    [title, description, difficulty].some(
      (field) => typeof field !== "string" || field.trim() === ""
    ) ||
    !Array.isArray(tags) ||
    tags.length === 0 ||
    !Array.isArray(testCases) ||
    testCases.length === 0
  ) {
    throw new ApiError(400, "All fields are required and must be valid");
  }

  const question = await Question.create({
    title,
    description,
    difficulty,
    tags,
    testCases,
    createBy: req?.user?._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, question, "Question create successfully"));
});

const updateQuestion = asyncHandler(async (req, res) => {
  const userRole = req.user.role;
  if (userRole !== "admin") {
    throw new ApiError(401, "Not authorized");
  }

  const { id: questionId } = req.params;

  const question = await Question.findOne({ _id: questionId });
  if (!question) {
    throw new ApiError(404, "Question not found");
  }

  const allowedFields = [
    "title",
    "description",
    "difficulty",
    "tags",
    "testCases",
  ];
  for (const key of allowedFields) {
    if (req.body[key] !== undefined) {
      question[key] = req.body[key];
    }
  }
  const updatedQuestion = await question.save();
  res
    .status(200)
    .json(
      new ApiResponse(200, updatedQuestion, "Question updated successfully")
    );
});

const deleteQuesiton = asyncHandler(async (req, res) => {
  const userRole = req.user.role;
  if (userRole !== "admin") {
    throw new ApiError(401, "Not authorized");
  }
  const { id: questionId } = req.params;

  const deletedQuestion = await Question.findByIdAndDelete(questionId);
  if (!deletedQuestion) {
    throw new ApiError(404, "Question not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Question deleted successfully"));
});
const getAllQuestions = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.difficulty) {
    filter.difficulty = req.query.difficulty;
  }

  if (req.query.tags) {
    const tags = req.query.tags.split(",");
    filter.tags = { $in: tags };
  }

  if (req.query.search) {
    filter.title = { $regex: req.query.search, $options: "i" };
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await Question.countDocuments(filter);
  const questions = await Question.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        questions,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
      "Fetched all questions"
    )
  );
});

const getSingleQuestion = asyncHandler(async (req, res) => {
  const { id: quesitonId } = req.params;
  const question = await Question.findById(quesitonId).populate(
    "createBy",
    "fullName"
  );
  return res
    .status(200)
    .json(new ApiResponse(200, question, "Question fetched seccessfully"));
});

export {
  createQuestion,
  updateQuestion,
  deleteQuesiton,
  getAllQuestions,
  getSingleQuestion,
};
