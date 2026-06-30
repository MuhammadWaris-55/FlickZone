import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()


//way of injecting middleware
router.route("/register").post(
    upload.fields([  //making this to handle multiple files 
        {
            name: "avatar", //this name should be same when make this field in frontend
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)
//Now the url will look like 
//http://localhost:8000/api/v1/users/register


router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser) //thats how we inject the middleware
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)

export default router