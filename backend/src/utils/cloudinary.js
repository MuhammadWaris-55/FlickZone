import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (fileBuffer) => {
    try {
        if (!fileBuffer) return null

        //upload the buffer to cloudinary via stream
        const response = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: "auto" }, //it will automatically detects what type of file it is
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            )
            streamifier.createReadStream(fileBuffer).pipe(uploadStream)
        })

        //file has been uploaded successfully
        // console.log("File is Uploaded on Cloudinary", response.url) //this will give us the public url of file that uploaded on cloudinary
        return response;
    } catch (error) {
        console.log("Error uploading to cloudinary:", error)
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