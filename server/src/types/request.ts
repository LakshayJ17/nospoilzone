import { Request } from "express";
import { Document, Types } from "mongoose";

export interface IUnlockedTitle {
    id: number | null;
    name: string;
    isCustom: boolean;
    genre: string[];
}

export interface IUser extends Document {
    id : Types.ObjectId;
    username: string;
    fullname: string;
    email: string;
    password: string;
    avatar?: string;
    unlockedTitles: IUnlockedTitle[];
    refreshToken?: string;
    createdAt?: Date;
    updatedAt?: Date;

    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}

export interface AuthRequest extends Request {
    user?: IUser;
}