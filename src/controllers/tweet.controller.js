import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {

    const { content } = req.body

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Content is required")
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user?._id
    })

    if (!tweet) {
        throw new ApiError(500, "Something went wrong while creating the tweet")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet created successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } =  req.params

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id")
    }

    const user = await User.findById(userId)

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const tweets = await Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [
                    {
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
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(200, tweets, "User tweets fetched successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}