import "dotenv/config";
import mongoose from "mongoose";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { faker } from "@faker-js/faker";
import { Video } from "../src/models/video.model.js";
import { User } from "../src/models/user.model.js";
import { DB_NAME } from "../src/constants.js";

// ---- CONFIG ----
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const CATEGORIES = [
    { query: "formula 1 racing", count: 20, titlePrefix: "F1" },
    { query: "gaming setup", count: 20, titlePrefix: "Gaming" },
    { query: "programmer coding", count: 20, titlePrefix: "Coding" },
    { query: "sports car racing", count: 20, titlePrefix: "Racing" },
];
const UPLOADER_USERNAME = "wariscodess"; // your existing account to attribute videos to

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const TEMP_DIR = path.resolve("./temp_seed");
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

async function downloadFile(url, filepath) {
    const res = await axios.get(url, { responseType: "stream" });
    const writer = fs.createWriteStream(filepath);
    res.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
    });
}

async function fetchPexelsVideos(query, count) {
    const res = await axios.get("https://api.pexels.com/videos/search", {
        headers: { Authorization: PEXELS_API_KEY },
        params: { query, per_page: count, orientation: "landscape" },
    });
    return res.data.videos;
}

function generateFakeMeta(prefix) {
    const titleThemes = {
        F1: ["Race Day Highlights", "Onboard Lap", "Pit Stop Action", "Grand Prix Moments", "Track Battle"],
        Gaming: ["Late Night Gaming Session", "Insane Clutch Moment", "New Setup Reveal", "Ranked Grind", "Gameplay Highlights"],
        Coding: ["Building a Web App", "Debugging Live", "Learning JavaScript", "My Coding Setup", "Late Night Coding"],
        Racing: ["Street Race", "Track Day", "Car Review", "Drift Session", "Supercar Sounds"],
    };

    const descriptionTemplates = {
        F1: [
            "Watch the intense action from today's race as drivers push their limits on the track.",
            "Onboard footage capturing every twist and turn of this thrilling Grand Prix moment.",
            "Pit stop precision at its finest — every second counts in this high-speed battle.",
            "Relive the best overtakes and dramatic moments from this exciting race weekend.",
        ],
        Gaming: [
            "Join me for an intense gaming session packed with clutch plays and epic moments.",
            "Check out this insane gameplay clip that had everyone on the edge of their seat.",
            "A quick look at my current gaming setup and the gear I use every day.",
            "Grinding through the ranks tonight — here are the best highlights from the session.",
        ],
        Coding: [
            "Follow along as I build this project step by step, explaining the logic along the way.",
            "A behind-the-scenes look at debugging real issues while working on this feature.",
            "Sharing my current coding setup and the tools that keep me productive.",
            "Late night coding session where I explore new concepts and write clean code.",
        ],
        Racing: [
            "High-octane footage from the streets, capturing speed and precision in every frame.",
            "A close look at this car's performance during an intense track day session.",
            "In-depth review covering design, power, and handling of this incredible machine.",
            "Pure adrenaline as these cars push through corners with perfect control.",
        ],
    };

    const themes = titleThemes[prefix] || [prefix];
    const theme = faker.helpers.arrayElement(themes);
    const title = `${theme} ${faker.word.adjective()}`;

    const descriptions = descriptionTemplates[prefix] || descriptionTemplates.F1;
    const description = faker.helpers.arrayElement(descriptions);

    return { title, description };
}

async function seed() {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("✅ Connected to MongoDB\n");

        // ---- DEBUG: Log all users in database ----
        console.log("🔍 DEBUG: Fetching all users from database...");
        const allUsers = await User.find({});
        console.log(`Found ${allUsers.length} users total:`);
        allUsers.forEach((u) => {
            console.log(`  - ID: ${u._id}, Username: "${u.username}"`);
        });

        console.log(`\n🔍 DEBUG: Looking for username: "${UPLOADER_USERNAME}"`);

        // ---- Find the uploader user ----
        const uploader = await User.findOne({ username: UPLOADER_USERNAME });
        console.log("Found user:", uploader ? "✅ YES" : "❌ NO\n");

        if (!uploader) {
            console.error(`\n❌ Error: User "${UPLOADER_USERNAME}" not found in database.`);
            console.error("Please choose one of the usernames listed above and update UPLOADER_USERNAME.\n");
            process.exit(1);
        }

        console.log(`✅ Using uploader: ${uploader.username} (ID: ${uploader._id})\n`);

        // ---- Start seeding videos ----
        for (const category of CATEGORIES) {
            console.log(`\n📹 Fetching "${category.query}" videos...`);
            const pexelsVideos = await fetchPexelsVideos(category.query, category.count);
            console.log(`Found ${pexelsVideos.length} videos from Pexels`);

            for (const pv of pexelsVideos) {
                try {
                    // Pick a reasonably sized video file (avoid 4K to keep upload fast)
                    const videoFile = pv.video_files.find((f) => f.quality === "sd") || pv.video_files[0];
                    const thumbnailUrl = pv.image;

                    const videoPath = path.join(TEMP_DIR, `${pv.id}.mp4`);
                    const thumbPath = path.join(TEMP_DIR, `${pv.id}.jpg`);

                    console.log(`  ⬇️  Downloading video ${pv.id}...`);
                    await downloadFile(videoFile.link, videoPath);
                    await downloadFile(thumbnailUrl, thumbPath);

                    console.log(`  ☁️  Uploading to Cloudinary...`);
                    const videoUpload = await cloudinary.uploader.upload(videoPath, { resource_type: "video" });
                    const thumbUpload = await cloudinary.uploader.upload(thumbPath, { resource_type: "image" });

                    const { title, description } = generateFakeMeta(category.titlePrefix);

                    await Video.create({
                        videoFile: videoUpload.secure_url,
                        thumbnail: thumbUpload.secure_url,
                        title,
                        description,
                        duration: pv.duration,
                        views: faker.number.int({ min: 10, max: 50 }),
                        isPublished: true,
                        owner: uploader._id,
                    });

                    console.log(`  ✅ Created: "${title}"`);

                    // Clean up local temp files
                    fs.unlinkSync(videoPath);
                    fs.unlinkSync(thumbPath);
                } catch (err) {
                    console.error(`  ❌ Failed on video ${pv.id}:`, err.message);
                }
            }
        }

        console.log("\n🎉 Seeding complete!");
        fs.rmSync(TEMP_DIR, { recursive: true, force: true });
        process.exit(0);
    } catch (err) {
        console.error("❌ Seed script error:", err.message);
        process.exit(1);
    }
}

seed();