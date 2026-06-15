import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

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

export default router