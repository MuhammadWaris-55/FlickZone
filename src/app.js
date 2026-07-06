import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();

//Configuring CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN,
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
import tweetRouter from "./routes/tweet.routes.js"

//routes declaration
app.use("/api/v1/users" , userRouter) //using app.use because router is in another file
//if we go to /users it will redirect us to userRouter
app.use("/api/v1/tweets", tweetRouter)

export { app }