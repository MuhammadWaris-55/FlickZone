import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10, 
        query, 
        sortBy, 
        sortType, 
        userId,
        duration,
        uploadDate
    } = req.query

    const matchStage = {
        isPublished: true
    }

    if(userId){
        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid user id")
        }
        matchStage.owner = new mongoose.Types.ObjectId(userId)
    }

    if (query) {
        matchStage.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ]
    }

    if (duration) {
        if (duration === "short") {
            matchStage.duration = { $lt: 240 }
        } else if (duration === "medium") {
            matchStage.duration = { $gte: 240, $lt: 1200 }
        } else if (duration === "long") {
            matchStage.duration = { $gt: 1200 }
        } else {
            throw new ApiError(400, "Invalid duration filter. Use short, medium or long")
        }
    }

    if (uploadDate) {
        const now = new Date()
        let fromDate

        if (uploadDate === "today") {
            fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        }else if (uploadDate === "week") {
            fromDate = new Date(now)
            fromDate.setDate(now.getDate() - 7)
        }else if (uploadDate === "month") {
            fromDate = new Date(now)
            fromDate.setMonth(now.getMonth() - 1)
        } else if (uploadDate === "year") {
            fromDate = new Date(now)
            fromDate.setFullYear(now.getFullYear() - 1)
        }else {
            throw new ApiError(400, "Invalid uploadDate filter . Use today, week, month, or year")
        }

        matchStage.createdAt = { $gte: fromDate }
    }

    const allowedSortFields = ["views", "duration", "createdAt", "title", "likesCount"]
    const sortStage = {}

    if (sortBy && allowedSortFields.includes(sortBy)) {
        sortStage[sortBy] = sortType === "asc" ? 1 : -1
    } else {
        sortStage.createdAt = -1
    }

    const videoAggregate = Video.aggregate([
        {
            $match: matchStage
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
         {
            $addFields: {
                owner: {
                    $first: "$owner"
                },
                likesCount: {
                    $size: "$likes"
                }
            }
        },
        {
            $project: {
                videoFile: 1,
                thumbnail: 1,
                title: 1,
                description: 1,
                duration: 1,
                views: 1,
                isPublished: 1,
                owner: 1,
                likesCount: 1,
                createdAt: 1,
                updatedAt: 1
            }
        },
        {
            $sort: sortStage
        }
    ])

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    }

      const videos = await Video.aggregatePaginate(videoAggregate, options)

    if (!videos) {
        throw new ApiError(500, "Something went wrong while fetching videos")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Videos fetched successfully"))

})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body

    if (!title?.trim() || !description?.trim()) {
        throw new ApiError(400, "Title and description are required")
    }

    const videoFileLocalPath = req.files?.videoFile?.[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    if (!videoFileLocalPath) {
        throw new ApiError(400, "Video file is required")
    }
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required")
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!videoFile) {
        throw new ApiError(400, "Failed to upload video file")
    }
    if (!thumbnail) {
        throw new ApiError(400, "Failed to upload thumbnail")
    }

    const video = await Video.create({
        title,
        description,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        duration: videoFile.duration,
        owner: req.user?._id
    })

    if (!video) {
        throw new ApiError(500, "Something went wrong while publishing the video")
    }

    return res
        .status(201)
        .json(new ApiResponse(201, video, "Video published successfully"))

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}