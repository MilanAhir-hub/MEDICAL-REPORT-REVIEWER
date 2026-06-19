import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: {
         type: String,
         required: true,
         unique: true,
     },
    password: {
        type: String,
        required: function () {
           return this.provider === "local";
        },
    },
    googleId: {
        type: String,
        // unique: true,
        sparse: true //allows multiple users to login without googleId
    },
    avatar: String,
    provider: {
        type: String,
        default: "local",
    },
    language: {
        type: String,
        default: "English",
    },
}, {
    timestamps: true
});

export default mongoose.model("User", userSchema);