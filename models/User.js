import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Schema
const userSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        unique: true,
        required: [true, "Please provide an email"],
    },
    password: {
        type: String,
        required: [true, "Please Enter Password"],
    },
    taskList: [
        {
            task: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Task"
            }

        }
    ]
})

// This function will run before the user is saved to databse
// Hash the password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
})

const User = mongoose.model("User", userSchema);
export default User;