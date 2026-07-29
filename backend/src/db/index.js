import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
      const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB Connected !! DB HOST: ${connectionInstance.connection.host}`);
        //.connection.host just tells you which server/machine your app connected to.
    } catch (error) {
        console.log("MongoDB Connection Error :" + error)
        // process.exit(1) is removed here — on Vercel's serverless environment, killing the
        // process abruptly produces confusing crash logs instead of a clean error response.
        // Throwing lets the caller (api/index.js) handle it and Vercel return a proper error.
        throw error
    }
}

export default connectDB