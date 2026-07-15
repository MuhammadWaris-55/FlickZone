import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
      const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB Connected !! DB HOST: ${connectionInstance.connection.host}`);
        //.connection.host just tells you which server/machine your app connected to.
    } catch (error) {
        console.log("MongoDB Connection Error :" + error)
        process.exit(1)
        //process is Node's way of referring to your currently running app.
        //process.exit() means → "stop the app right now"
        //The number 1 is the exit code, which signals that the app stopped due to an error
    }
}

export default connectDB