import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import passport from "passport";
import cors from "cors";
import session from "cokkie-session";
import { connectDB } from "./config/database.js";
import { initializePassport } from "./utility/passportConfig.js";

dotenv.config({ path: "./config/config.env" });
connectDB();

const app = express();
initializePassport(passport);

app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: false,
    maxAge: 1000 * 60 * 15,
    cookie: {
        secure: true
    }
}));

// Express Session
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    "Access-Control-Allow-Origin": "*"

}));


// Routes
import { userRouter } from "./routes/userRoutes.js";
import { taskRouter } from "./routes/taskRoutes.js";
import { getRouter } from "./routes/getRoute.js"

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/task", taskRouter);
app.use('/api/v1/user', getRouter);

// Port
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
