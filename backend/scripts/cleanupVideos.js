import "dotenv/config";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { Video } from "../src/models/video.model.js";
import { User } from "../src/models/user.model.js";
import { DB_NAME } from "../src/constants.js";

const UPLOADER_USERNAME = "wariscodess"; // same username used in seedVideos.js

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Extracts the Cloudinary public_id from a secure_url so we can delete the asset
function getPublicIdFromUrl(url, resourceType) {
  try {
    // Example URL: https://res.cloudinary.com/<cloud>/video/upload/v123456/wariscodes/abc123.mp4
    const parts = url.split("/upload/")[1]; // "v123456/wariscodes/abc123.mp4"
    const withoutVersion = parts.split("/").slice(1).join("/"); // "wariscodes/abc123.mp4"
    const publicId = withoutVersion.replace(/\.[^/.]+$/, ""); // remove file extension
    return publicId;
  } catch (err) {
    console.warn(`⚠️  Could not parse public_id from URL: ${url}`);
    return null;
  }
}

async function cleanup() {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log("✅ Connected to MongoDB\n");

    const uploader = await User.findOne({ username: UPLOADER_USERNAME });
    if (!uploader) {
      console.error(`❌ User "${UPLOADER_USERNAME}" not found.`);
      process.exit(1);
    }

    const videos = await Video.find({ owner: uploader._id });
    console.log(`🔍 Found ${videos.length} seeded videos for "${UPLOADER_USERNAME}"\n`);

    if (videos.length === 0) {
      console.log("Nothing to delete. Exiting.");
      process.exit(0);
    }

    let deletedCount = 0;
    let failedCount = 0;

    for (const video of videos) {
      try {
        // Delete video asset from Cloudinary
        const videoPublicId = getPublicIdFromUrl(video.videoFile, "video");
        if (videoPublicId) {
          await cloudinary.uploader.destroy(videoPublicId, { resource_type: "video" });
        }

        // Delete thumbnail asset from Cloudinary
        const thumbPublicId = getPublicIdFromUrl(video.thumbnail, "image");
        if (thumbPublicId) {
          await cloudinary.uploader.destroy(thumbPublicId, { resource_type: "image" });
        }

        // Delete the video document from MongoDB
        await Video.findByIdAndDelete(video._id);

        console.log(`  ✅ Deleted: "${video.title}"`);
        deletedCount++;
      } catch (err) {
        console.error(`  ❌ Failed to delete "${video.title}":`, err.message);
        failedCount++;
      }
    }

    console.log(`\n🎉 Cleanup complete! Deleted: ${deletedCount}, Failed: ${failedCount}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Cleanup script error:", err.message);
    process.exit(1);
  }
}

cleanup();