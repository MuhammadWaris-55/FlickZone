import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import{ ApiResponse } from "../utils/ApiResponse.js"


//we will do this things many times in our code thats why putting it in a method
const generateAccessAndRefreshTokens = async(userId) => {
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
    //To write the logic of registration of user we have to make some steps to solve this problem
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
    const {fullname, email, username, password} = req.body
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
        $or: [{ username } , { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with username or email already exist")
    }

    console.log(req.files)

    // check for images, avatar , we got req.files from multer(middleware)
    //this means If files were uploaded, and if there's an avatar, give me the local disk path of the first one
   const avatarLocalPath = req.files?.avatar?.[0]?.path
    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path 
    
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
      coverImageLocalPath = req.files.coverImage[0].path  
    }

    //check for avatar
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    // upload on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

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

const loginUser = asyncHandler( async (req, res) => {
    //To write the logic of user login we have to make some steps to solve this problem
    //get data from req.body
    //take username or email
    //find the user 
    //if user found check password
    //if password correct generate & send access and refresh token to user
    //send secure cookie
    //return response


    const {username, email, password} = req.body

    if (!username || !email) {
        throw new ApiError(400, "username or email is required")
    }

    //checking what we got email or username
    const user = await User.findOne({
        $or: [{username}, {email}]
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

const logoutUser = asyncHandler( async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

     const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"))
})

export { 
    registerUser,
    loginUser,
    logoutUser
}