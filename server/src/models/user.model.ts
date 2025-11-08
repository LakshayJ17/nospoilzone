import mongoose from "mongoose";
import { IUser } from "../types/request";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema<IUser>({
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
        default: null
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

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

export const User = mongoose.model<IUser>("User", userSchema)