import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

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


videoSchema.plugin(mongooseAggregatePaginate) //By using this we can write the aggregation querries in MongoDB
// YouTube shows "Page 1, 2, 3..." or loads more videos as you scroll?
//That's pagination.
//Doing pagination manually with aggregation is annoying. This plugin does it for you automatically.

export const Video = mongoose.model("Video" , videoSchema)