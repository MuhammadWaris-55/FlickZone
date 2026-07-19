import axiosInstance from "@/api/axiosInstance";

export const toggleVideoLike = async (videoId) => {
  const res = await axiosInstance.post(`/likes/toggle/v/${videoId}`);
  return res.data.data;
};