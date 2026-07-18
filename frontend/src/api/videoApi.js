import axiosInstance from "@/api/axiosInstance";

export const getAllVideos = async (params = {}) => {
    const res = await axiosInstance.get("/videos", { params });
    return res.data.data; // adjust based on your ApiResponse shape (docs, totalDocs, etc.)
};