import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api/v1", // proxied by vite in dev
  withCredentials: true, // sends httpOnly cookies
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // prevent infinite retry loop
      try {
        await axiosInstance.post("/users/refresh-token");
        return axiosInstance(originalRequest); // retry the original request
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;