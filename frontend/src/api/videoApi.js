import axiosInstance from "@/api/axiosInstance";

export const getAllVideos = async (params = {}) => {
    const res = await axiosInstance.get("/videos", { params });
    return res.data.data; // adjust based on your ApiResponse shape (docs, totalDocs, etc.)
};

export const getVideoById = async (videoId) => {
  const res = await axiosInstance.get(`/videos/${videoId}`);
  return res.data.data;
};

export const publishVideo = async (formData, onUploadProgress) => {
  const res = await axiosInstance.post("/videos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event) => {
      const percent = Math.round((event.loaded * 100) / event.total);
      onUploadProgress?.(percent);
    },
  });
  return res.data.data;
};

export const getVideosByOwner = async (ownerId) => {
  const res = await axiosInstance.get("/videos", { params: { userId: ownerId } });
  return res.data.data;
};