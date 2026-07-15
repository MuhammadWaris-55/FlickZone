# FlickZone

**A full-stack, YouTube-inspired video hosting platform — built for scale, security, and real-world engineering practice.**

FlickZone replicates the core mechanics of a production-grade content platform: video publishing, secure authentication, and social interactions such as comments, tweets, and subscriptions. This repository currently documents the **backend**, engineered with a strong focus on scalable architecture, consistent error handling, and industry-standard backend patterns.

---

## Overview

FlickZone is designed to mirror the backend systems that power modern video-sharing platforms. It handles user authentication, video upload and management, engagement features (comments, tweets, likes), and media storage — all built with production-style patterns rather than tutorial-level shortcuts.

The project was built as a deep-dive into backend system design, with an emphasis on:
- Clean, reusable utility abstractions
- Secure authentication flows
- Efficient database querying and aggregation
- Robust error and response handling
- Scalable file/media management

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Media Storage:** Cloudinary
- **Authentication:** JSON Web Tokens (JWT) — Access & Refresh Token flow

---

## Core Architecture & Patterns

FlickZone's backend is structured around a set of reusable utilities and middleware that standardize how the API behaves across all routes:

- **`asyncHandler`** — A wrapper utility that eliminates repetitive try/catch blocks across async route handlers and forwards errors to centralized error handling.
- **`ApiError`** — A custom error class that standardizes error responses across the entire application, ensuring consistent status codes and error payloads.
- **`ApiResponse`** — A standardized response wrapper that ensures every successful API response follows a consistent structure.
- **`verifyJWT` Middleware** — Protects private routes by validating access tokens before allowing access to controller logic.

This layered approach keeps controllers lean and focused purely on business logic, while cross-cutting concerns (errors, responses, auth) are handled consistently across the app.

---

## Authentication

FlickZone implements a secure, production-style authentication system:

- **Access & Refresh Token flow** using JWT
- Tokens stored via **httpOnly cookies** to protect against XSS-based token theft
- Refresh token rotation for maintaining secure, persistent sessions
- Middleware-based route protection for authenticated actions (uploading, commenting, tweeting, subscribing, etc.)

---

## Features Implemented

### User Management
- User registration and login with hashed password storage
- JWT-based session handling (access + refresh tokens)
- Secure logout with token invalidation

### Video Management
- **`publishAVideo`** — Upload and publish videos with metadata, thumbnail, and Cloudinary-hosted media
- **`getAllVideos`** — Fetch videos with support for search, sorting, and pagination via aggregation pipelines
- **`getVideoById`** — Retrieve a single video with detailed, aggregated data
- **`updateVideo`** — Update video metadata and thumbnail, with old Cloudinary assets cleaned up automatically
- **`deleteVideo`** — Remove a video along with its associated Cloudinary media
- **`togglePublishStatus`** — Toggle a video between published and unpublished states

### Comments
- Full CRUD support for comments on videos
- Comments linked to both the video and the authenticated user
- Paginated comment retrieval for performance at scale

### Tweets
- A lightweight tweet/post system allowing users to share short-form updates
- Full CRUD operations, scoped to the authenticated user

### Media Handling
- **Multer** for handling multipart form-data uploads
- **Cloudinary** integration for persistent, scalable media storage
- Automatic cleanup of orphaned/replaced media assets on update or delete operations

### Database Design
- Mongoose schemas modeling Users, Videos, Comments, Tweets, and Subscriptions
- MongoDB aggregation pipelines used for efficient data joins, filtering, and pagination
- **mongoose-aggregate-paginate-v2** integrated for scalable, paginated aggregation queries

---

## API Endpoints

All routes are prefixed with `/api/v1`. Endpoints marked **Protected** require a valid access token via the `verifyJWT` middleware.

### Users

| Method | Endpoint | Description | Access |
|--------|----------|--------------|--------|
| POST | `/users/register` | Register a new user | Public |
| POST | `/users/login` | Authenticate user and issue tokens | Public |
| POST | `/users/logout` | Invalidate refresh token and clear cookies | Protected |
| POST | `/users/refresh-token` | Issue a new access token using a valid refresh token | Public |

### Videos

| Method | Endpoint | Description | Access |
|--------|----------|--------------|--------|
| GET | `/videos` | Get all videos with search, sort, and pagination | Protected |
| POST | `/videos` | Publish a new video | Protected |
| GET | `/videos/:videoId` | Get a single video by ID | Protected |
| PATCH | `/videos/:videoId` | Update video metadata/thumbnail | Protected |
| DELETE | `/videos/:videoId` | Delete a video and its associated media | Protected |
| PATCH | `/videos/toggle/publish/:videoId` | Toggle a video's publish status | Protected |

### Comments

| Method | Endpoint | Description | Access |
|--------|----------|--------------|--------|
| GET | `/comments/:videoId` | Get paginated comments for a video | Protected |
| POST | `/comments/:videoId` | Add a comment to a video | Protected |
| PATCH | `/comments/c/:commentId` | Update a comment | Protected |
| DELETE | `/comments/c/:commentId` | Delete a comment | Protected |

### Tweets

| Method | Endpoint | Description | Access |
|--------|----------|--------------|--------|
| POST | `/tweets` | Create a new tweet | Protected |
| GET | `/tweets/user/:userId` | Get all tweets by a specific user | Protected |
| PATCH | `/tweets/:tweetId` | Update a tweet | Protected |
| DELETE | `/tweets/:tweetId` | Delete a tweet | Protected |

---

## Author

Built by **Muhammad Waris** ([@WarisCodes](https://x.com/WarisCodes)) — Full-Stack Developer 

- Portfolio: [wariscodes.com](https://wariscodes.com)
- GitHub: [MuhammadWaris-55](https://github.com/MuhammadWaris-55)