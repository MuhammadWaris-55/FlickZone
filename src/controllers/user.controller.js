import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js";

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
    //if user created return response, if not send a error


    //Getting user details
    const {fullname, email, username, password} = req.body
    console.log("email: " , email);

    //Validation check
    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    // check if user already exist
    const existedUser = User.findOne({
        $or: [{ usernam } , { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with username or email already exist")
    }

    // check for images, avatar
})

export { registerUser }