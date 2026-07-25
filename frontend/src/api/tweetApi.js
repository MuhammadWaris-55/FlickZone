import axiosInstance from "@/api/axiosInstance";

export const getUserTweets = async (userId) => {
    const res = await axiosInstance.get(`/tweets/user/${userId}`);
    return res.data.data;
};

export const createTweet = async (content) => {
    const res = await axiosInstance.post("/tweets", { content });
    return res.data.data;
};

export const updateTweet = async (tweetId, content) => {
    const res = await axiosInstance.patch(`/tweets/${tweetId}`, { content });
    return res.data.data;
};

export const deleteTweet = async (tweetId) => {
    const res = await axiosInstance.delete(`/tweets/${tweetId}`);
    return res.data.data;
};