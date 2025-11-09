import dotenv from "dotenv"
import { ApiError } from "../utils/ApiError";

dotenv.config()

interface Config {
    port: number;
    mongouri: string;
    accesstokensecret: string;
    accesstokenexpiry: string;
    refreshtokensecret: string;
    refreshtokenexpiry: string;
    cloudinarycloudname: string;
    cloudinaryapikey: string;
    cloudinaryapisecret: string
}

if (!process.env.MONGO_URI) {
    throw new Error("Missing required env variable: MONGO_URI")
}

if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("Missing required env variable: ACCESS_TOKEN_SECRET")
}

if (!process.env.ACCESS_TOKEN_EXPIRY) {
    throw new Error("Missing required env vatrable : ACCESS_TOKEN_EXPIRY")
}

if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("Missing required env variable : REFRESH_TOKEN_SECRET")
}

if (!process.env.REFRESH_TOKEN_EXPIRY) {
    throw new Error("Missing required env variable : REFRESH_TOKEN_EXPIRY")
}

if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error("Missing required env variable : CLOUDINARY_CLOUD_NAME")
}

if (!process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Missing required env variable : CLOUDINARY_API_SECRET")
}

if (!process.env.CLOUDINARY_API_KEY) {
    throw new Error("Missing required env variable : CLOUDINARY_API_KEY")
}

export const config: Config = {
    port: Number(process.env.PORT) || 8000,
    mongouri: process.env.MONGO_URI as string,
    accesstokensecret: process.env.ACCESS_TOKEN_SECRET as string,
    accesstokenexpiry: process.env.ACCESS_TOKEN_EXPIRY as string,
    refreshtokensecret: process.env.REFRESH_TOKEN_SECRET as string,
    refreshtokenexpiry: process.env.REFRESH_TOKEN_EXPIRY as string,
    cloudinarycloudname: process.env.CLOUDINARY_CLOUD_NAME as string,
    cloudinaryapikey: process.env.CLOUDINARY_API_KEY as string,
    cloudinaryapisecret: process.env.CLOUDINARY_API_SECRET as string
}