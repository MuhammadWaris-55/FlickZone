import axiosInstance from "@/api/axiosInstance";

export const getChannelProfile = async (username) => {
    const res = await axiosInstance.get(`/users/c/${username}`);
    return res.data.data;
};