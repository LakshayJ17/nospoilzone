import { v2 as cloudinary } from "cloudinary"
import { config } from "../config/config"
import fs from "fs"

cloudinary.config({
    cloud_name: config.cloudinarycloudname,
    api_key: config.cloudinaryapikey,
    api_secret: config.cloudinaryapisecret
})

const uploadOnCloudinary = async (filePath : string) => {
    try {
        if (!filePath) {
            return null
        }

        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto"
        })

        console.log("File uploaded on :", response);
        return response
    } catch (error) {
        console.log("Error uploading file on cloudinary : ", error)
        fs.unlinkSync(filePath)
        return null
    }
}

export { uploadOnCloudinary }