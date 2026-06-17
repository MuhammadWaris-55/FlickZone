import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto" //it will automatically detects what type of file it is
        })
        //file has been uploaded successfully
        // console.log("File is Uploaded on Cloudinary", response.url) //this will give us the public url of file that uploaded on cloudinary
        fs.unlinkSync(localFilePath) //this will remove the file if it has uploaded
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) //this will remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

export { uploadOnCloudinary }