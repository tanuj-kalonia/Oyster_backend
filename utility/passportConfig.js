import LocalS from "passport-local";
import bcrypt from "bcryptjs"
import User from "../models/User.js";

const LocalStratergy = LocalS.Strategy;

export const initializePassport = (passport) => {
    passport.use(
        // Local Stratergy
        new LocalStratergy(async (username, password, done) => {
            try {
                // Check if user exists
                const user = await User.findOne({ username });
                if (!user) return done(null, false, { message: "User not found" });
                // console.log(user);

                // Check if password is correct
                const isMatch = await bcrypt.compare(password.toString(), user.password.toString());
                if (!isMatch) return done(null, false);

                // console.log("User logged in");

                const result = {
                    name: user.name,
                    username: user.username,
                    tasklist: user.taskList,
                    id: user._id
                }
                // Return user
                // console.log(result);
                return done(null, result, { message: "Logged in successfully" });

            } catch (error) {
                console.log(error);
                return done(error, false);
            }
        })
    )

    // Serialize and Deserialize User
    passport.serializeUser((result, done) => done(null, result.id));
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user));
    });
}