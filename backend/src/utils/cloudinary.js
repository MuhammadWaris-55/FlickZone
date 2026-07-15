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


const deleteFromCloudinary = async (fileUrl, resourceType = "image") => {
    try {
        if (!fileUrl) return null

        // cloudinary URLs look like:
        // https://res.cloudinary.com/<cloud_name>/image/upload/v1234567/folder/publicId.jpg
        // we need just the "publicId" part (without extension) to delete it
        const publicId = fileUrl
            .split("/")
            .pop()          // "publicId.jpg"
            .split(".")[0]  // "publicId"

        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType // "image" for thumbnails, "video" for video files
        })

        return result
    } catch (error) {
        console.log("Error deleting file from cloudinary:", error)
        return null
    }
}

export { uploadOnCloudinary, deleteFromCloudinary }