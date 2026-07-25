import axiosInstance from "@/api/axiosInstance";

export const getVideoComments = async (videoId) => {
  const res = await axiosInstance.get(`/comments/${videoId}`);
  return res.data.data;
};

export const addComment = async (videoId, content) => {
  const res = await axiosInstance.post(`/comments/${videoId}`, { content });
  return res.data.data;
};

export const updateComment = async (commentId, content) => {
  const res = await axiosInstance.patch(`/comments/c/${commentId}`, { content });
  return res.data.data;
};

export const deleteComment = async (commentId) => {
  const res = await axiosInstance.delete(`/comments/c/${commentId}`);
  return res.data.data;
};