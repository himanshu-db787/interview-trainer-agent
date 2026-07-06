const mongoose = require("mongoose");

const qaSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    modelAnswer: { type: String, required: true },
    improvementTips: { type: String, required: true },
  },
  { _id: false }
);

const interviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    jobTitle: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    experienceLevel: {
      type: String,
      enum: ["fresher", "junior", "mid", "senior"],
      default: "fresher",
    },
    resumeSnippet: {
      type: String,
      default: "",
    },
    qaPairs: [qaSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("InterviewSession", interviewSessionSchema);