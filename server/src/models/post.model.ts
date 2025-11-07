import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
            trim: true
        },
        options: [{ type: String, required: true }],
        correctIndex: { type: Number, required: true }
    },
    { _id: false }
)

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: { type: String, required: true, trim: true },
    image: { type: String, default: null },
    movie: {
        id: { type: Number, default: null },
        name: { type: String, required: true },
        isCustom: { type: Boolean, default: false },
        genre: { type: [String], default: [] }
    },
    quiz: [quizSchema],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true })

export const Post = mongoose.model("Post", postSchema)