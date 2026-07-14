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
            .json(new ApiResponse(200,{ subscribed: false },"Unsubscribed successfully"))
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
        .json(new ApiResponse(200,{ subscribed: true },"Subscribed successfully"))
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}