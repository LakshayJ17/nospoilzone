import mongoose from "mongoose";
import { IUser } from "../types/request";
import bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken";
import { config } from "../config/config";

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
        default: "http://res.cloudinary.com/ds551q6ll/image/upload/v1762703561/pa5ab4quollc181cksoc.webp"
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

userSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        config.accesstokensecret as jwt.Secret,
        { expiresIn: config.accesstokenexpiry } as jwt.SignOptions
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        config.refreshtokensecret as jwt.Secret,
        { expiresIn: config.refreshtokenexpiry } as jwt.SignOptions
    )
}

export const User = mongoose.model<IUser>("User", userSchema)