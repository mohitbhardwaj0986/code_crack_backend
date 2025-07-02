import mongoose from "mongoose";

const mockInterviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    questions: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    feedBack: {
      type: String,
    },
    score: {
      type: Number,
    },
    performanceLevel: {
      type: String,
      enum: ["Excellent", "Good", "Average", "Poor"],
      default: "Average",
    },
  },
  { timestamps: true }
);

const MockInterview = mongoose.model("MockInterview", mockInterviewSchema);
export default MockInterview;
