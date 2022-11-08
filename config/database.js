import mongoose from "mongoose";

export const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI)
        .then(success => console.log("Connected to MongoDB"))
        .catch(error => console.log(error));
}