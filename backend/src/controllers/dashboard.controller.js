import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    // the "channel" is just the logged in user, since dashboard shows YOUR channel's data
    const channelId = req.user?._id

    if (!channelId) {
        throw new ApiError(401, "Unauthorized request")
    }

    // 1) Total subscribers for this channel
    // we count how many documents in Subscription have this channel as "channel"
    const totalSubscribers = await Subscription.countDocuments({
        channel: channelId
    })

    // 2) Total videos, total views, and total likes
    // we do this in ONE aggregation pipeline on Video collection to avoid multiple DB calls
    const videoStats = await Video.aggregate([
        {
            // only pick videos that belong to this channel (owner)
            $match: {
                owner: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            // for every video, find its likes from the Like collection
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            // now group all matched videos together to get totals
            $group: {
                _id: null, // null means group everything into a single result
                totalVideos: {
                    $sum: 1 // count 1 for every video document
                },
                totalViews: {
                    $sum: "$views" // add up the "views" field of every video
                },
                totalLikes: {
                    $sum: {
                        $size: "$likes" // count how many likes each video has, then sum
                    }
                }
            }
        }
    ])

    // if channel has no videos, aggregation returns an empty array
    // so we set safe default values instead of crashing
    const stats = {
        totalSubscribers,
        totalVideos: videoStats[0]?.totalVideos || 0,
        totalViews: videoStats[0]?.totalViews || 0,
        totalLikes: videoStats[0]?.totalLikes || 0
    }

    return res
        .status(200)
        .json(new ApiResponse(200, stats, "Channel stats fetched successfully"))

})

const getChannelVideos = asyncHandler(async (req, res) => {
    // Get all the videos uploaded by the channel

    const channelId = req.user?._id

    if (!channelId) {
        throw new ApiError(401, "Unauthorized request")
    }

    const videos = await Video.aggregate([
        {
            // only videos owned by the logged in user (channel)
            $match: {
                owner: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            // get likes for each video so we can show like count on dashboard
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            // add extra computed fields to each video document
            $addFields: {
                likesCount: {
                    $size: "$likes"
                },
                createdAt: {
                    // format date as "DD Month YYYY" style, easier to show on UI
                    $dateToParts: { date: "$createdAt" }
                }
            }
        },
        {
            // sort newest videos first
            $sort: {
                createdAt: -1
            }
        },
        {
            // only send fields the frontend actually needs
            $project: {
                _id: 1,
                videoFile: 1,
                thumbnail: 1,
                title: 1,
                description: 1,
                duration: 1,
                views: 1,
                isPublished: 1,
                likesCount: 1,
                createdAt: 1
            }
        }
    ])

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Channel videos fetched successfully"))
})

export {
    getChannelStats,
    getChannelVideos
}