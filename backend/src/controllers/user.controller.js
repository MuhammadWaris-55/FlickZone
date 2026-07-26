import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


//we will do this things many times in our code thats why putting it in a method
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        // Fetch the user document from the database using their ID
        const user = await User.findById(userId)

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // Store the refresh token in DB
        user.refreshToken = refreshToken

        // Save the updated user document
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating Access and Refresh tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend
    //check validation - not empty (or password and email in correct format)
    //check if user already exist (we can check from username and email)
    //check for images , check for avatar properly uploaded or not
    //if the images available then upload on cloudinary , check for avatar
    //create user object - create entry in DB
    //remove password and refresh token field from response
    //check for user creation
    //return response


    //Getting user details
    const { fullname, email, username, password } = req.body
    // console.log("email: " , email);
    // console.log(req.body)

    //Validation check
    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    // check if user already exist
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with username or email already exist")
    }

    // console.log(req.files)

    // check for images, avatar , we got req.files from multer(middleware)
    // NOTE: since multer now uses memoryStorage (for Vercel compatibility), files are
    // no longer saved to disk — they live in memory as buffers, accessed via .buffer instead of .path
    const avatarBuffer = req.files?.avatar?.[0]?.buffer
    // const coverImageBuffer = req.files?.coverImage?.[0]?.buffer 

    let coverImageBuffer;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageBuffer = req.files.coverImage[0].buffer
    }

    //check for avatar
    if (!avatarBuffer) {
        throw new ApiError(400, "Avatar file is required")
    }

    // upload on cloudinary
    const avatar = await uploadOnCloudinary(avatarBuffer)
    const coverImage = await uploadOnCloudinary(coverImageBuffer)

    //check for avatar again
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    //create user object - create entry in DB
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    //remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        //in this method all fields selected by default so "-" means unselect it
        "-password -refreshToken"
    )

    // check for user creation
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while regitering the user")
    }

    //return res
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    //get data from req.body
    //take username or email
    //find the user 
    //if user found check password
    //if password correct generate & send access and refresh token to user
    //send secure cookie
    //return response


    const { username, email, password } = req.body

    if (!(username || email)) {
        throw new ApiError(400, "username or email is required")
    }

    //checking what we got email or username
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    //  check password
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Password is incorrect")
    }

    //access and refresh token 
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    //send secure cookie
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    //by doing this cookies will only be modified by server not from anyone on frontend
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User Logged In Successfully"
            )
        )

})

const logoutUser = asyncHandler(async (req, res) => {
    // Find the logged-in user and remove their refresh token from the DB
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            returnDocument: 'after'
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    // Send success response and clear both cookies from the browser
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User Logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    // Extract refresh token from cookies (browsers) or request body (mobile/API clients)
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        // Verify the token's signature and expiry using the refresh token secret
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        // Use the _id embedded in the decoded token to find the user in DB
        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token")
        }

        // Compare incoming token with the one stored in DB
        // If they don't match, the token was already used or is stolen 
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        // Generate a fresh access token and a new refresh token (old one gets replaced in DB)
        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id)

        // Send new tokens back via secure cookies and also in the JSON body
        // Cookies: for browsers | JSON body: for mobile/API clients that can't use cookies
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    // Find the currently logged-in user from DB using their id (attached to req by auth middleware)
    const user = await User.findById(req.user?._id)

    // Check if the provided old password matches the hashed password stored in DB
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    // Set the new password on the user object (will be hashed by the pre-save hook in User model)
    user.password = newPassword

    // Save to DB — validateBeforeSave: false skips schema validation since we only changed the password
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Current user fetched successfully"))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullname, email } = req.body

    if (!fullname || !email) {
        throw new ApiError(400, "All fields are required")
    }

    // Find the logged-in user by ID and update their fullname and email
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname,
                email
            }
        },
        // { new: true } returns the updated document instead of the old one
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"))
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    // Get the buffer of the uploaded avatar file from multer (memoryStorage, not disk anymore)
    const avatarBuffer = req.file?.buffer

    // Validate that a file was actually uploaded
    if (!avatarBuffer) {
        throw new ApiError(400, "Avatar file is missing")
    }

    // Upload the buffer to Cloudinary and get the result
    const avatar = await uploadOnCloudinary(avatarBuffer)

    // Validate that Cloudinary returned a valid URL
    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading avatar")
    }

    // Find the logged-in user by ID and update their avatar URL
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url // Store only the Cloudinary URL, not the local path
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar updated successfully"))
})

const updateUserCoverImage = asyncHandler(async (req, res) => {
    // Get the buffer of the uploaded Cover Image file from multer (memoryStorage, not disk anymore)
    const coverImageBuffer = req.file?.buffer

    // Validate that a file was actually uploaded
    if (!coverImageBuffer) {
        throw new ApiError(400, "Cover Image file is missing")
    }

    // Upload the buffer to Cloudinary and get the result
    const coverImage = await uploadOnCloudinary(coverImageBuffer)

    // Validate that Cloudinary returned a valid URL
    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading Cover Image")
    }

    // Find the logged-in user by ID and update their Cover Image URL
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url // Store only the Cloudinary URL, not the local path
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Cover Image updated successfully"))
})

const getUserChannelProfile = asyncHandler(async (req, res) => {
    // Extract username from the URL params (e.g. /channel/waris → "waris")
    const {username} = req.params

    if (!username?.trim()) {
        throw new ApiError(400, "Username is missing")
    }

    // Run aggregation pipeline on the User collection
    const channel = await User.aggregate([
        // STAGE 1: Find the user whose username matches the one in the URL
        {
            $match: {
                username: username?.toLowerCase() // lowercase to make search case-insensitive
            }
        },
        // STAGE 2: Find all subscribers of this channel
        // Go to "subscriptions" collection and get all docs where "channel" = this user's _id
        // These are the people who subscribed to this channel
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        // STAGE 3: Find all channels this user has subscribed to
        // Same collection, opposite direction — where "subscriber" = this user's _id
        // These are the channels this user follows
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        // STAGE 4: Compute new fields from the data we just looked up
        {
            $addFields: {
                // Count how many people are in the subscribers array
                subscribersCount: {
                    $size: "$subscribers"
                },
                // Count how many channels this user subscribes to
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                // Check if the currently logged-in user is in the subscribers list
                // If yes → they are subscribed, if no → they are not
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }   
                }
            }
        },
        // STAGE 5: Shape the final output — only send what the frontend needs
        {
            $project: {
                fullname: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1

            }
        }
    ])

    // console.log(channel)

    // aggregate() always returns an array — if it's empty, the channel doesn't exist
    if (!channel?.length) {
        throw new ApiError(404, "Channel does not exist")
    }

    // Send back channel[0] because aggregate returns an array
    // but we only matched one user, so the data is at index 0
    return res
    .status(200)
    .json(
        new ApiResponse(200, channel[0], "User channel fetched successfully")
    )

})

const getWatchHistory = asyncHandler(async (req, res) => {
    // req.user._id is a string, but aggregation pipelines don't auto-cast 
    // types like normal Mongoose queries do — so we manually wrap it 
    // in mongoose.Types.ObjectId to make sure $match actually finds the user
    const user = await User.aggregate([
        {
            // Stage 1: find the currently logged-in user by their _id
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            // Stage 2: right now watchHistory is just a list of video IDs.
            // This joins with the "videos" collection to turn those IDs 
            // into full video details (title, thumbnail, etc.)
            $lookup: {
                from: "videos", // which collection to look into
                localField: "watchHistory", // the list of video IDs we already have on the user
                foreignField: "_id", // match those IDs to the "_id" field in videos
                as: "watchHistory", // put the results back into watchHistory (replacing the IDs)

                //sub-pipeline before attaching the video data
                // on each video to also fetch its owner's info
                pipeline: [
                    {
                        // nested lookup: get the owner (uploader) of each video
                        $lookup: {
                            from: "users",
                            localField: "owner", // the owner's ID stored on the video
                            foreignField: "_id", // match it to "_id" in the users collection
                            as: "owner",
                            pipeline: [
                                {
                                    // only expose safe, public fields — 
                                    // keeps password/refreshToken etc. out of the response
                                    $project: {
                                        fullname: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        // $lookup always returns an array, even for a single match.
                        // Since a video has exactly one owner, unwrap the array 
                        // into a plain object using $first (same as $arrayElemAt: [$owner, 0])
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    // console.log(user)

    // aggregate() always returns an array of matched docs, unlike findById()
    // which returns a single document. Since _id is unique, there's only 
    // ever one match, so we grab it with user[0]
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].watchHistory,
            "Watch History fetched successfully"
        )
    )
})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
}