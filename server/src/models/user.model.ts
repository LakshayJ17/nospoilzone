import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    avatar: {
        type: String,
        // default: Add cloudinary url of something default
    },
    unlockedTitles: [
        {
            id: { type: Number, default: null },
            name: { type: String, required: true },
            isCustom: { type: Boolean, default: false },
            genre: { type: [String], default: [] }

        }
    ],
    refreshToken: {
        type: String
    }

}, { timestamps: true })

export const User = mongoose.model("User", userSchema)