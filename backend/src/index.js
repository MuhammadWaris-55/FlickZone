// import dotenv from "dotenv"
// dotenv.config({
//     path : "./.env"
// })
import "./config.js" 
import connectDB from "./db/index.js";
import { app } from "./app.js";


connectDB()
.then(() => {
    app.listen(process.env.PORT || 5000, () =>{
        console.log(`App is Running on port: ${process.env.PORT}`);
        
    })
})
.catch((err) => {
    console.log("MongoDB Connection Failed !!" + err);
    
})
