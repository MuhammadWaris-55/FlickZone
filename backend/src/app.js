import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();

//Configuring CORS
// CORS_ORIGIN can contain multiple comma-separated URLs (e.g. localhost for dev + deployed frontend for prod)
// browsers only accept ONE origin value in the response header, so we can't pass the raw comma-separated
// string directly into cors() - instead we split it into a list and dynamically check the incoming
// request's origin against that list, returning just the matching one
const allowedOrigins = process.env.CORS_ORIGIN.split(",").map(origin => origin.trim())

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps, curl, or Postman) since they don't send an origin header
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true
}))


//Data will come from many places like from URl , JSON , or from req.body means form so these are settings to handle that data or configurations to handle the data  .

app.use(express.json({ //This means accepting json data
    limit: "20kb" //this shows that how much data it can accept it usually depends on power of server or etc
}))

app.use(express.urlencoded({ //This is for to encode the url that user enters because url not comes same everytime , it includes special characters so this will encode it
    extended: true,
    limit: "20kb"
}))

app.use(express.static("public")) //this will accept file and folders or any asset like img or vid etc and store it on server in public folder 

app.use(cookieParser()) //the work of cookie parser is that we can access cookies of server (user's browser) and sets it and operates CRUD operation on thier cookies

//A cookie is a small piece of data the server sends to the client, which the browser stores and automatically sends back with every subsequent request to that server.
// A cookie is just a small text file the server tells your browser to save.


//import Routes
import userRouter from "./routes/user.route.js";
import tweetRouter from "./routes/tweet.route.js"
import commentRouter from "./routes/comment.route.js"
import videoRouter from "./routes/video.route.js"
import likeRouter from "./routes/like.route.js"
import playlistRouter from "./routes/playlist.route.js"
import subscriptionRouter from "./routes/subscription.route.js"
import dashboardRouter from "./routes/dashboard.route.js"
import healthcheckRouter from "./routes/healthcheck.route.js"

//routes declaration
app.use("/api/v1/users", userRouter) //using app.use because router is in another file
//if we go to /users it will redirect us to userRouter
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/dashboard", dashboardRouter)
app.use("/api/v1/healthcheck", healthcheckRouter)

export { app }