import axiosInstance from "@/api/axiosInstance";

export const toggleSubscription = async (channelId) => {
  const res = await axiosInstance.post(`/subscriptions/c/${channelId}`);
  return res.data.data;
};

export const getSubscribedChannels = async (userId) => {
  const res = await axiosInstance.get(`/subscriptions/u/${userId}`);
  return res.data.data;
};