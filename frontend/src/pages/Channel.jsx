import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useChannel } from "@/hooks/useChannel";
import { getVideosByOwner } from "@/api/videoApi";
import ChannelBanner from "@/components/ChannelBanner";
import ChannelTabs from "@/components/ChannelTabs";
import VideoCard from "@/components/VideoCard";
import VideoCardSkeleton from "@/components/VideoCardSkeleton";

export default function Channel() {
  const { username } = useParams();
  const { channel, loading } = useChannel(username);
  const [activeTab, setActiveTab] = useState("Videos");

  const [channelVideos, setChannelVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(true);

  useEffect(() => {
    if (channel?._id) {
      setVideosLoading(true);
      getVideosByOwner(channel._id)
        .then((data) => setChannelVideos(data.docs || data || []))
        .catch(() => setChannelVideos([]))
        .finally(() => setVideosLoading(false));
    }
  }, [channel?._id]);

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="h-64 rounded-2xl shimmer" />
      </div>
    );
  }

  if (!channel) {
    return <p className="p-6 text-muted-foreground">Channel not found.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <ChannelBanner channel={channel} />
      <ChannelTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === "Videos" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {videosLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <VideoCardSkeleton key={i} />
                  ))
                ) : channelVideos.length ? (
                  channelVideos.map((video, i) => (
                    <VideoCard key={video._id} video={video} index={i} />
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm col-span-full">
                    No videos uploaded yet.
                  </p>
                )}
              </div>
            )}

            {activeTab === "Playlists" && (
              <p className="text-muted-foreground text-sm">No playlists yet.</p>
            )}
            {activeTab === "Tweets" && (
              <p className="text-muted-foreground text-sm">No tweets yet.</p>
            )}
            {activeTab === "Subscribed" && (
              <p className="text-muted-foreground text-sm">
                Not subscribed to any channels yet.
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}