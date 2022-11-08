import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    taskOwner: String,
    title: String,
    description: String,
    completed: Boolean,
})

const Task = mongoose.model("Task", taskSchema);
export default Task;