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
});

const questionSchema = new mongoose.Schema(
  {
    tile: {
      type: String,
      required: true,
    },
    description: {
      type: true,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    tags: {
      type: String,
      required: true,
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
