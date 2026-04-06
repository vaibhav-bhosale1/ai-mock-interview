import mongoose from "mongoose";

const MockInterviewSchema = new mongoose.Schema({
  jsonMockResp: { type: String, required: true },
  jobPosition:  { type: String, required: true },
  jobDesc:      { type: String, required: true },
  jobExperience:{ type: String, required: true },
  createdBy:    { type: String, required: true },
  createdAt:    { type: String, required: true },
  mockId:       { type: String, required: true },
});

const UserAnswerSchema = new mongoose.Schema({
  mockIdRef:  { type: String, required: true },
  question:   { type: String, required: true },
  correctAns: { type: String },
  userAns:    { type: String },
  feedback:   { type: String },
  rating:     { type: String },
  userEmail:  { type: String, required: true },
  createdAt:  { type: String },
});

export const MockInterview = mongoose.models.MockInterview
  || mongoose.model("MockInterview", MockInterviewSchema);

export const UserAnswer = mongoose.models.UserAnswer
  || mongoose.model("UserAnswer", UserAnswerSchema);