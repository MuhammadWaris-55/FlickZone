import mongoose, {Schema} from "mongoose";

const videoSchema = new Schema(
    {
        videoFile: {
            type: String, ////use cloudinary url later 
            required: true
        },
        thumbnail: {
            type: String, ////use cloudinary url later 
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        views: {
            type: Number,
            default: 0,
            required: true
        },
        isPublished: {
            type: Boolean,
            default: true  
        }
    }, 
    {
        timestamps: true
    }
)


export const Video = mongoose.model("Video" , videoSchema)