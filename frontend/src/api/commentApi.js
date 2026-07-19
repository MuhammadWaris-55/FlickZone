import axiosInstance from "@/api/axiosInstance";

export const getVideoComments = async (videoId) => {
  const res = await axiosInstance.get(`/comments/${videoId}`);
  return res.data.data;
};

export const addComment = async (videoId, content) => {
  const res = await axiosInstance.post(`/comments/${videoId}`, { content });
  return res.data.data;
};