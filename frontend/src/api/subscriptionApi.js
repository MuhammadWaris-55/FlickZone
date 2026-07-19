import axiosInstance from "@/api/axiosInstance";

export const toggleSubscription = async (channelId) => {
  const res = await axiosInstance.post(`/subscriptions/c/${channelId}`);
  return res.data.data;
};