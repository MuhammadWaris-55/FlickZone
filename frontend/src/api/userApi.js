import axiosInstance from "@/api/axiosInstance";

export const getChannelProfile = async (username) => {
    const res = await axiosInstance.get(`/users/c/${username}`);
    return res.data.data;
};

export const updateAccountDetails = async (fullname, email) => {
    const res = await axiosInstance.patch("/users/update-account", { fullname, email });
    return res.data.data;
};

export const updateAvatar = async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    const res = await axiosInstance.patch("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
};

export const updateCoverImage = async (file) => {
    const formData = new FormData();
    formData.append("coverImage", file);
    const res = await axiosInstance.patch("/users/cover-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
};

export const changePassword = async (oldPassword, newPassword) => {
    const res = await axiosInstance.post("/users/change-password", { oldPassword, newPassword });
    return res.data.data;
};