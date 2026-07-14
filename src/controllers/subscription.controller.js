import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    // step 1: basic validation - channelId must be a real mongo id
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id")
    }

    // step 2: a user should not be able to subscribe to their own channel
    if (channelId.toString() === req.user._id.toString()) {
        throw new ApiError(400, "You cannot subscribe to your own channel")
    }

    // step 3: make sure the channel (which is just a User document) actually exists
    const channel = await User.findById(channelId)

    if (!channel) {
        throw new ApiError(404, "Channel not found")
    }

    // step 4: check if the subscription already exists
    // (subscriber = logged in user, channel = the one whose id came from params)
    const existingSubscription = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId
    })

    // step 5: toggle logic
    // - if it already exists -> user wants to unsubscribe -> delete it
    // - if it does not exist -> user wants to subscribe -> create it
    if (existingSubscription) {
        await Subscription.findByIdAndDelete(existingSubscription._id)

        return res
            .status(200)
            .json(new ApiResponse(200, { subscribed: false }, "Unsubscribed successfully"))
    }

    const newSubscription = await Subscription.create({
        subscriber: req.user._id,
        channel: channelId
    })

    if (!newSubscription) {
        throw new ApiError(500, "Something went wrong while subscribing")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { subscribed: true }, "Subscribed successfully"))
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id")
    }

    // we use an aggregation pipeline because we don't just want the raw
    // Subscription documents (which only hold ObjectIds) - we want the
    // actual subscriber user details (name, avatar, username etc.)
    const subscribers = await Subscription.aggregate([
        {
            // step 1: match only the documents where "channel" is the channel we care about
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            // step 2: join with the "users" collection to pull subscriber details
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriber",
                pipeline: [
                    {
                        // sub-pipeline to also check if this subscriber
                        // is themselves subscribed back to the channel owner
                        // (useful for showing "subscribed back" badges on frontend)
                        $lookup: {
                            from: "subscriptions",
                            localField: "_id",
                            foreignField: "channel",
                            as: "subscribedToSubscriber"
                        }
                    },
                    {
                        $addFields: {
                            subscribedToSubscriber: {
                                $cond: {
                                    if: {
                                        $in: [
                                            new mongoose.Types.ObjectId(channelId),
                                            "$subscribedToSubscriber.subscriber"
                                        ]
                                    },
                                    then: true,
                                    else: false
                                }
                            },
                            subscribersCount: {
                                $size: "$subscribedToSubscriber"
                            }
                        }
                    },
                    {
                        // only send back the fields the frontend actually needs
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1,
                            subscribedToSubscriber: 1,
                            subscribersCount: 1
                        }
                    }
                ]
            }
        },
        {
            // $lookup always returns an array, so we unwind to flatten
            // one subscription document -> one subscriber object
            $unwind: "$subscriber"
        },
        {
            // step 3: shape the final response to only include what's needed
            $project: {
                _id: 0,
                subscriber: 1
            }
        }
    ])

    return res
        .status(200)
        .json(new ApiResponse(200, subscribers, "Subscribers fetched successfully"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params


    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber id")
    }

    const subscribedChannels = await Subscription.aggregate([
        {
            // step 1: match only the documents where "subscriber" is the user we care about
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            // step 2: join with "users" collection to pull the channel's details
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channel",
                pipeline: [
                    {
                        // also fetch the videos of that channel
                        // so frontend can show a preview without another request
                        $lookup: {
                            from: "videos",
                            localField: "_id",
                            foreignField: "owner",
                            as: "videos"
                        }
                    },
                    {
                        $addFields: {
                            latestVideo: {
                                $last: "$videos"
                            }
                        }
                    },
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1,
                            latestVideo: {
                                _id: 1,
                                videoFile: 1,
                                thumbnail: 1,
                                title: 1,
                                description: 1,
                                duration: 1,
                                createdAt: 1,
                                views: 1
                            }
                        }
                    }
                ]
            }
        },
        {
            // flatten the channel array into a single object
            $unwind: "$channel"
        },
        {
            $project: {
                _id: 0,
                channel: 1
            }
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(200, subscribedChannels, "Subscribed channels fetched successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}