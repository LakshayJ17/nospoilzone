import { Request } from "express";
import { Document } from "mongoose";

export interface IUnlockedTitle {
    id: number | null;
    name: string;
    isCustom: boolean;
    genre: string[];
}

export interface IUser extends Document {
    username: string;
    fullname: string;
    email: string;
    password: string;
    avatar?: string;
    unlockedTitles: IUnlockedTitle[];
    refreshToken?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface AuthRequest extends Request {
    user?: IUser
}