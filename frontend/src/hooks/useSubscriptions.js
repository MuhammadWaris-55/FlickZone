import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getSubscribedChannels } from "@/api/subscriptionApi";
import { getVideosByOwner } from "@/api/videoApi";

export function useSubscriptions() {
    const { user } = useAuth();
    const [channels, setChannels] = useState([]);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?._id) return;

        setLoading(true);
        getSubscribedChannels(user._id)
            .then(async (subs) => {
                const channelList = subs.map((s) => s.channel || s);
                setChannels(channelList);

                // Fetch recent videos from all subscribed channels in parallel
                const videoLists = await Promise.all(
                    channelList.map((ch) => getVideosByOwner(ch._id).catch(() => []))
                );

                const merged = videoLists
                    .flatMap((list) => list.docs || list || [])
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setVideos(merged);
            })
            .catch(() => {
                setChannels([]);
                setVideos([]);
            })
            .finally(() => setLoading(false));
    }, [user?._id]);

    return { channels, videos, loading };
}