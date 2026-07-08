import mongoose, {isValidObjectId} from "mongoose"
import {Comment} from "../models/comment.model.js"
import { Video } from "../models/video.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    // videoId comes from the route param, page/limit are optional query params
    // with sane defaults so the frontend doesn't have to always send them
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    // confirm the video actually exists before fetching comments for it
    // (avoids returning an empty paginated result for a nonexistent video
    // without telling the client why)

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    // build the aggregation pipeline WITHOUT $skip/$limit -
    // aggregatePaginate will inject those stages itself based on `options`
    const commentsAggregate = Comment.aggregate([
        {
            // only fetch comments belonging to this specific video
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            // join in the comment owner's user info from the users collection
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        // only pull the fields the frontend needs -
                        $project: {
                            username: 1,
                            fullname: 1,
                            avatar: 1
                        }
                    }
                ]

            }
        },
        {
            // $lookup always returns an array, even for a single match -
            // $first flattens it into a plain object for easier frontend use
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }
        },
        {
            //newest comments first
            $sort: {
                createdAt: -1
            }
        }
    ])

    // page/limit arrive as strings from req.query, so convert to numbers
    // before handing off to the pagination plugin
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    }

    // runs the pipeline + applies skip/limit + returns pagination metadata
    const comments = await Comment.aggregatePaginate(commentsAggregate, options)

    return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"))

})

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { content } = req.body

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    if (!content?.trim()) {
        throw new ApiError(400, "Content is required")
    }

    // make sure we're not attaching a comment to a video that doesn't exist
    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    // this is how we know WHO is posting the comment
    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user?._id
    })

    if (!comment) {
        throw new ApiError(500, "Failed to add a comment , please try again")
    }

    return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const { content } = req.body

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id")
    }

    if (!content?.trim()) {
        throw new ApiError(400, "Content is required")
    }

    // fetch the comment first so we can check both existence AND ownership
    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    // AUTHORIZATION check - authentication (verifyJWT) only confirms the user
    // is logged in, this confirms they actually own THIS specific comment.
    // Without this, any logged-in user could edit someone else's comment.
    if (comment.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Only the comment owner can edit this comment")
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content
            }
        },
        {
            new: true
        }
    )

    if (!updatedComment) {
        throw new ApiError(500, "Failed to update comment please try again")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully"))

})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id")
    }

    // same pattern as updateComment - fetch first to verify existence + ownership
    // before allowing the delete
    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    if (comment.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Only the comment owner can delete this comment")
    }

    const commentToDelete = await Comment.findByIdAndDelete(commentId)

    if (!commentToDelete) {
        throw new ApiError(500, "Failed to delete comment, please try again")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, commentToDelete, "Comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
}