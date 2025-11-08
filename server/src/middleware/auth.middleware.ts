import { NextFunction, Response } from "express";
import { config } from "../config/config";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/AsyncHandler";
import jwt from "jsonwebtoken"
import { AuthRequest } from "../types/request";

interface JwtPayload {
    _id: string;
    iat: number;
    exp: number;
}

export const verifyJWT = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "Unauthorized user")
        }

        const decodedToken = jwt.verify(token, config.accesstokensecret) as JwtPayload

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "Invalid access token")
        }

        req.user = user
        next()
    } catch (error: any) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }

})