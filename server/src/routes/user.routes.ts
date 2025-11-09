import { Router } from "express";
import { upload } from "../middleware/multer.middleware";
import { changeCurrentPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar } from "../controllers/user.controllers";
import { verifyJWT } from "../middleware/auth.middleware";

const userRouter = Router()

userRouter.route('/register').post(
    upload.single("avatar"),
    registerUser
)

userRouter.route('/login').post(loginUser)
userRouter.route('/logout').post(verifyJWT, logoutUser)
userRouter.route('/refresh-token').post(refreshAccessToken)
userRouter.route('/change-password').post(verifyJWT, changeCurrentPassword)
userRouter.route('/current-user').get(verifyJWT, getCurrentUser)
userRouter.route('/update-details').post(verifyJWT, updateAccountDetails)
userRouter.route("/cover-image").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)


export default userRouter