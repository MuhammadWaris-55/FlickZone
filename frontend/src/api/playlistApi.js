import axiosInstance from "@/api/axiosInstance";

export const getUserPlaylists = async (userId) => {
    const res = await axiosInstance.get(`/playlist/user/${userId}`);
    return res.data.data;
};

export const createPlaylist = async (name, description) => {
    const res = await axiosInstance.post("/playlist", { name, description });
    return res.data.data;
};

export const getPlaylistById = async (playlistId) => {
    const res = await axiosInstance.get(`/playlist/${playlistId}`);
    return res.data.data;
};

export const addVideoToPlaylist = async (playlistId, videoId) => {
    const res = await axiosInstance.patch(`/playlist/add/${videoId}/${playlistId}`);
    return res.data.data;
};

export const removeVideoFromPlaylist = async (playlistId, videoId) => {
    const res = await axiosInstance.patch(`/playlist/remove/${videoId}/${playlistId}`);
    return res.data.data;
};

export const deletePlaylist = async (playlistId) => {
    const res = await axiosInstance.delete(`/playlist/${playlistId}`);
    return res.data.data;
};