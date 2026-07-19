// import { Router } from 'express';
// import {
//     addComment,
//     deleteComment,
//     getVideoComments,
//     updateComment,
// } from "../controllers/comment.controller.js"
// import {verifyJWT} from "../middlewares/auth.middleware.js"

// const router = Router();

// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// router.route("/:videoId").get(getVideoComments).post(addComment);
// router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

// export default router

import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

// Public — guests can view comments without logging in
router.route("/:videoId").get(getVideoComments);

// Protected — must be logged in to post/edit/delete
router.use(verifyJWT);

router.route("/:videoId").post(addComment);
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router