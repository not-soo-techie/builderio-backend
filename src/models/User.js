import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  name: String,
  email: {
    type: String,
    unique: true,
  },
  photo: {
    type: String,
  },
  hasAssignedProject: {
    type: Boolean,
    default: false,
  },
  assignedProjectId: {
    type: Number,
    // ref: "Task",
  },
  assignedAt: Date,
  githubRepoUrl: {
    type: String,
  },

  hasSubmittedProject: {
    type: Boolean,
    default: false,
  },

  submittedAt: {
    type: Date,
  },
});

export default mongoose.model("User", userSchema);
