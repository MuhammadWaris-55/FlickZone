import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { Video } from "../models/video.model.js"
import { Comment } from "../models/comment.model.js"
import { Tweet } from "../models/tweet.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const existingReaction = await Like.findOne({
        video: videoId,
        likedBy: req.user?._id
    })

    // no reaction yet -> create a dislike
    if (!existingReaction) {
        await Like.create({
            video: videoId,
            likedBy: req.user?._id,
            type: "dislike"
        })

        return res
            .status(200)
            .json(new ApiResponse(200, { isDisliked: true }, "Video disliked successfully"))
    }

    // already disliked -> remove dislike (toggle off)
    if (existingReaction.type === "dislike") {
        await Like.findByIdAndDelete(existingReaction._id)

        return res
            .status(200)
            .json(new ApiResponse(200, { isDisliked: false }, "Dislike removed from video"))
    }

    // was liked -> switch to dislike
    existingReaction.type = "dislike"
    await existingReaction.save()

    return res
        .status(200)
        .json(new ApiResponse(200, { isDisliked: true }, "Video disliked successfully"))

})

const toggleVideoDislike = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const existingReaction = await Like.findOne({
        video: videoId,
        likedBy: req.user?._id
    })

    // no reaction yet -> create a dislike
    if (!existingReaction) {
        await Like.create({
            video: videoId,
            likedBy: req.user?._id,
            type: "dislike"
        })

        return res
            .status(200)
            .json(new ApiResponse(200, { isDisliked: true }, "Video disliked successfully"))
    }

    // already disliked -> remove dislike (toggle off)
    if (existingReaction.type === "dislike") {
        await Like.findByIdAndDelete(existingReaction._id)

        return res
            .status(200)
            .json(new ApiResponse(200, { isDisliked: false }, "Dislike removed from video"))
    }

    // was liked -> switch to dislike
    existingReaction.type = "dislike"
    await existingReaction.save()

    return res
        .status(200)
        .json(new ApiResponse(200, { isDisliked: true }, "Video disliked successfully"))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id")
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user?._id
    })

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id)

        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: false }, "Comment unliked successfully"))
    }

    await Like.create({
        comment: commentId,
        likedBy: req.user?._id,
        type: "like"
    })

    return res
        .status(200)
        .json(new ApiResponse(200, { isLiked: true }, "Comment liked successfully"))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet id")
    }

    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user?._id
    })

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id)

        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: false }, "Tweet unliked successfully"))
    }

    await Like.create({
        tweet: tweetId,
        likedBy: req.user?._id,
        type: "like"
    })

    return res
        .status(200)
        .json(new ApiResponse(200, { isLiked: true }, "Tweet liked successfully"))

}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideos = await Like.aggregate([
        {
            // only this user's likes, and only reactions on videos
            // (Like model is shared across video/comment/tweet, so we filter it down)
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user?._id),
                type: "like",
                video: { $exists: true, $ne: null }
            }
        },
        {
            // join the actual video document for each like
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
                pipeline: [
                    {
                        // get the video's owner details too
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner"
                        }
                    },
                    {
                        // owner lookup returns an array, flatten it to a single object
                        $unwind: "$owner"
                    },
                    {
                        // only send the fields the frontend actually needs
                        $project: {
                            videoFile: 1,
                            thumbnail: 1,
                            title: 1,
                            description: 1,
                            duration: 1,
                            views: 1,
                            isPublished: 1,
                            createdAt: 1,
                            owner: {
                                username: 1,
                                fullName: 1,
                                avatar: 1
                            }
                        }
                    }
                ]
            }
        },
        {
            // $lookup always returns an array, flatten it since it's one video per like
            $unwind: "$video"
        },
        {
            // most recently liked video first
            $sort: {
                createdAt: -1
            }
        },
        {
            // drop the Like document's own fields, keep only the video
            $project: {
                _id: 0,
                video: 1
            }
        }
    ])

    return res
        .status(200)
        .json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"))

})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    toggleVideoDislike,
    getLikedVideos
}