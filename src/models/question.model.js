import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String, 
    required: true,
  },
  output: {
    type: String,
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
});

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    functionName: {
      type: String,
      required: true,
    },
    starterCode: {
      type: String,
      required: true,
    },
    constraints: {
      type: String,
    },
    examples: {
      type: [String], 
    },
    testCases: {
      type: [testCaseSchema],
      required: true,
    },
    createBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);

export default Question;
