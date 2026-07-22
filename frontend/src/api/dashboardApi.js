import axiosInstance from "@/api/axiosInstance";

export const getChannelStats = async () => {
    const res = await axiosInstance.get("/dashboard/stats");
    return res.data.data;
};

export const getChannelVideos = async () => {
    const res = await axiosInstance.get("/dashboard/videos");
    return res.data.data;
};