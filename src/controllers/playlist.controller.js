import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body

    // both fields are required, so validate before hitting the DB
    if (!name?.trim() || !description?.trim()) {
        throw new ApiError(400, "Name and description are required")
    }

    // create the playlist, owner comes from the logged-in user (via verifyJWT middleware)
    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user?._id
    })

    if (!playlist) {
        throw new ApiError(500, "Something went wrong while creating the playlist")
    }

    return res
        .status(201)
        .json(new ApiResponse(201, playlist, "Playlist created successfully"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params

    // make sure the id actually looks like a valid mongo ObjectId
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id")
    }

    // aggregate all playlists belonging to this user
    // along with basic video count + total views, useful for a "My Playlists" page
    const playlists = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos"
            }
        },
        {
            $addFields: {
                totalVideos: {
                    $size: "$videos"
                },
                totalViews: {
                    $sum: "$videos.views"
                }
            }
        },
        {
            $project: {
                name: 1,
                description: 1,
                totalVideos: 1,
                totalViews: 1,
                updatedAt: 1
            }
        }
    ])

    return res
        .status(200)
        .json(new ApiResponse(200, playlists, "User playlists fetched successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    // check if the id is a valid mongo ObjectId
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }

    // fetch playlist along with populated video details (only the fields we actually need)
    const playlist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                },
                totalVideos: {
                    $size: "$videos"
                },
                totalViews: {
                    $sum: "$videos.views"
                }
            }
        },
        {
            $project: {
                name: 1,
                description: 1,
                totalVideos: 1,
                totalViews: 1,
                createdAt: 1,
                videos: {
                    _id: 1,
                    thumbnail: 1,
                    title: 1,
                    duration: 1,
                    views: 1
                },
                owner: {
                    username: 1,
                    fullName: 1,
                    avatar: 1
                }
            }
        }
    ])

    // aggregate always returns an array, empty array means no playlist found
    if (!playlist?.length) {
        throw new ApiError(404, "Playlist not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlist[0], "Playlist fetched successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    // validate both ids before touching the DB
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist id or video id")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    // only the owner of the playlist is allowed to add videos to it
    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to modify this playlist")
    }

    // $addToSet prevents duplicate entries (unlike $push, it won't add the same video twice)
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet: {
                videos: videoId
            }
        },
        {
            new: true
        }
    )

    if (!updatedPlaylist) {
        throw new ApiError(500, "Something went wrong while adding video to playlist")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Video added to playlist successfully"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

     const { playlistId, videoId } = req.params

    // validate both ids before touching the DB
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist id or video id")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    // only the owner of the playlist is allowed to remove videos from it
    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to modify this playlist")
    }

    // $pull removes the matching videoId from the videos array
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: {
                videos: videoId
            }
        },
        {
            new: true
        }
    )

    if (!updatedPlaylist) {
        throw new ApiError(500, "Something went wrong while removing video from playlist")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Video removed from playlist successfully"))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    // TODO: delete playlist
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}