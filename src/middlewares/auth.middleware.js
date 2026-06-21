import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export const verifyJWT = asyncHandler(async(req, res, next) => {
   try {
     // Try to get the token from cookies first,
     // fall back to the Authorization header (e.g. "Bearer <token>") for clients like Postman/mobile
     const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
 
     if (!token) {
         throw new ApiError(401, "Unauthorized request")
     }
 
     const decodedTokenInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
 
     const user = await User.findById(decodedTokenInfo?._id).select("-password -refreshToken")
 
     if (!user) {
         throw new ApiError(401, "Invalid Access Token")
     }
 
     // Attach the authenticated user to the request object
     // so next function can access it via req.user
     req.user = user;
     // Pass control to the next middleware/route handler
     next()
   } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
   }
})