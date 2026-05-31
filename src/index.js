import dotenv from "dotenv"
import connectDB from "./db/index.js";

dotenv.config({
    path : "./.env"
})

connectDB()




















// import express from "express";
// const app = express();

// // Usign iife
// ( async => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error" , (error) => {
//             console.log("App is not able to talk with Database" + error)
//             throw error
//         })

//         app.listen(process.env.PORT , () => {
//             console.log(`App is Running on http://localhost:${PORT}`)
//         })
//     } catch (error) {
//         console.log("ERROR :" + error)
//         throw error
//     }
// })()