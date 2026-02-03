import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  description: String
});

export default mongoose.model("Task", taskSchema);
