import { useState, useEffect } from "react";
import { getChannelStats, getChannelVideos } from "@/api/dashboardApi";

export function useDashboard() {
    const [stats, setStats] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getChannelStats(), getChannelVideos()])
            .then(([statsData, videosData]) => {
                setStats(statsData);
                setVideos(videosData.docs || videosData || []);
            })
            .catch(() => {
                setStats(null);
                setVideos([]);
            })
            .finally(() => setLoading(false));
    }, []);

    const removeVideoFromList = (videoId) => {
        setVideos((prev) => prev.filter((v) => v._id !== videoId));
    };

    const updateVideoInList = (videoId, updates) => {
        setVideos((prev) => prev.map((v) => (v._id === videoId ? { ...v, ...updates } : v)));
    };

    return { stats, videos, loading, removeVideoFromList, updateVideoInList };
}