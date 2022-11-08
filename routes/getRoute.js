import express from "express";
import Task from "../models/Task.js"
import User from "../models/User.js"
export const getRouter = express.Router();

getRouter.post("/", async (req, res) => {
    try {
        if (!req.body.user) {
            return res.status(400).json({
                success: false,
                message: 'Please Login'
            })
        }
        var allTask = [];
        const user = await User.findById(req.body.user)
        console.log('req', req.body)
        if (!user) return res.status(400).json({ sucess: false, message: "User not found" });
        for (let i = 0; i < user.taskList.length; i++) {
            const task = await Task.findById(user.taskList[i]._id).select("-__v");
            if (task) allTask.push(task);
        }
        console.log(`allTask ${allTask}`);
        return res.status(200).json({
            success: true,
            user,
            allTask
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
})