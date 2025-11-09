import { Response, CookieOptions } from "express";
import { User } from "../models/user.model";
import { AuthRequest, IUser } from "../types/request";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";
import jwt, { JwtPayload } from "jsonwebtoken"
import { config } from "../config/config";

const generateAccessAndRefreshToken = async (userId: string) => {
    try {
        const user = await User.findById(userId)

        if (!user) {
            throw new ApiError(404, "User not found")
        }

        const accessToken = (user as IUser).generateAccessToken();
        const refreshToken = (user as IUser).generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token")
    }
}

const registerUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    // take user input -> validate -> check if user already exists ->  check for optional avatar -> store user in db -> Fetch user w/o password and refreshToken -> return user 

    const { username, fullname, email, password } = req.body

    if ([username, fullname, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (existingUser) {
        throw new ApiError(409, "User with same email or username already exists")
    }

    const avatarLocalPath = req.file?.path;
    let avatar;
    console.log("REQ.FILE : ", req.file)


    if (avatarLocalPath) {
        avatar = await uploadOnCloudinary(avatarLocalPath)
    }

    const user = await User.create({
        fullname,
        email,
        password,
        username: username.toLowerCase(),
        avatar: avatar?.url
    })

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id as string)

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating user")
    }

    const options: CookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, createdUser, "User created successfully"))
})

const loginUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    // get user details -> validate -> match password -> generate tokens -> send response

    const { username, email, password } = req.body

    if (!(username || email)) {
        throw new ApiError(400, "Username or email is required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User not found")
    }
    const isPasswordValid = await user?.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Credentials are not correct")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id as string)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    if (!loggedInUser) {
        throw new ApiError(500, "Something went wrong while fetching user")
    }

    const options: CookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, loggedInUser, "User logged in successfully"))
})

const logoutUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user || !req.user._id) {
        throw new ApiError(401, "Unauthorized");
    }

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options: CookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"))
})

const refreshAccessToken = asyncHandler(async (req: AuthRequest, res: Response) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, config.refreshtokensecret) as JwtPayload

        if (!decodedToken) {
            throw new ApiError(401, "Unauthorized request")
        }

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const options: CookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id as string)

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(200, {}, "Access token refreshed")
            )
    } catch (error: any) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    // get old and currentPassword -> hash old password and check from db -> if fine hash current password and update in db 
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id)

    if (!user) {
        throw new ApiError(404, "User not found")
    }
    const isPasswordValid = await user?.isPasswordCorrect(oldPassword)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid old password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "Current user fetched successfully"))
})

const updateAccountDetails = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { fullname, email } = req.body

    if (!fullname?.trim() && !email?.trim()) {
        throw new ApiError(400, "At least one field is required to update");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser && (existingUser._id as any).toString() !== req.user?._id?.toString()) {
        throw new ApiError(409, "Email already in use by another account");
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: {
                fullname,
                email
            }
        },
        { new: true } // returns updated values 
    ).select("-password -refreshToken")

    return res.status(200).json(new ApiResponse(200, user, "Account details updated succesfully"))
})

const updateUserAvatar = asyncHandler(async (req: AuthRequest, res: Response) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const response = await uploadOnCloudinary(avatarLocalPath)

    if (!response?.url) {
        throw new ApiError(500, "Error uploading on cloudinary")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: response.url
            }
        },
        {
            new: true
        }
    ).select("-password -refreshToken")

    return res.status(200).json(new ApiResponse(200, user, "Avatar updated successfully"))
})

export { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar }