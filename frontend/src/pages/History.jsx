import { useEffect, useState } from "react";
import { History as HistoryIcon } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import EmptyState from "@/components/EmptyState";
import VideoCard from "@/components/VideoCard";
import VideoCardSkeleton from "@/components/VideoCardSkeleton";

export default function History() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/users/history")
      .then((res) => setVideos(res.data.data || []))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="font-heading text-2xl font-bold mb-6">Watch History</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => <VideoCardSkeleton key={i} />)}
        </div>
      ) : videos.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {videos.map((video, i) => <VideoCard key={video._id} video={video} index={i} />)}
        </div>
      ) : (
        <EmptyState
          icon={HistoryIcon}
          title="No watch history"
          description="Videos you watch will appear here, making it easy to pick up where you left off."
          actionLabel="Start watching"
          actionTo="/"
        />
      )}
    </div>
  );
}