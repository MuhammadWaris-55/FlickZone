// api/index.js
import "../src/config.js"
import { app } from "../src/app.js";
import connectDB from "../src/db/index.js";

// Serverless functions can be invoked many times per minute, and each invocation
// could spin up a fresh instance. Without caching, we'd open a brand new MongoDB
// connection on every single request, which is slow and can exhaust Atlas's
// connection limit quickly. This cache reuses the same connection promise across
// invocations of the same warm function instance.
let isConnected = false;

const ensureDbConnected = async () => {
    if (!isConnected) {
        await connectDB();
        isConnected = true;
    }
}

// connect immediately when this module loads, so requests don't have to wait
// on a cold instance's very first call
ensureDbConnected();

export default app;