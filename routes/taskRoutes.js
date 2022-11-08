import express from "express";
import User from "../models/User.js"
import Task from "../models/Task.js"

export const taskRouter = express.Router();

taskRouter.post("/", async (req, res) => {
    try {

        const { title, description, userId } = req.body;
        console.log(title, description, userId);

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Please enter all fields"
            });
        }

        const user = await User.findById(userId).select("-password");
        if (!user) return res.status(400).json({
            success: false,
            message: "Unautherized User"
        });

        console.log(user);

        const task = await Task.create({ taskOwner: userId, title, description });
        await task.save();

        user.taskList.push(task);
        user.save();

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            user
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }

})

// delete a task
taskRouter.post("/delete", async (req, res) => {
    try {
        console.log("delete clicked");
        const { taskId, userId } = req.body;
        console.log(taskId, userId);

        if (!userId) return res.status(400).json({
            success: false,
            message: "Please Login"
        });

        if (!taskId) return res.status(400).json({
            success: false,
            message: "Task not exists"
        });

        const task = await Task.findById(taskId);
        console.log(task);

        if (!task) return res.status(400).json({
            success: false,
            message: "Task does not exists"
        });

        if (task.taskOwner.toString() !== userId) return res.status(400).json({
            success: false,
            message: "Unautherized User"
        });

        await task.remove();

        res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        })

    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        })
    }
})
// update a task
taskRouter.post("/update", async (req, res) => {
    try {


        const { taskId, userId, title, description } = req.body;
        if (!taskId) return res.status(400).json({
            success: false,
            message: "Task not exists"
        });
        if (!userId) return res.status(400).json({
            success: false,
            message: "Please login"
        });

        const task = await Task.findById(taskId);
        if (!task) return res.status(400).json({
            success: false,
            message: "Task does not exists"
        });

        if (task.taskOwner.toString() !== userId) return res.status(400).json({ message: "Unautherized User" });

        if (title) task.title = title;
        if (description) task.description = description;


        await task.save();

        res.status(200).json({
            success: true,
            message: "Task Updated successfully",
            updatedTask: task
        })

    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        })
    }
})