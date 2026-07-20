import { useEffect, useState } from "react";
import { ThumbsUp } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import EmptyState from "@/components/EmptyState";
import VideoCard from "@/components/VideoCard";
import VideoCardSkeleton from "@/components/VideoCardSkeleton";

export default function LikedVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/likes/videos")
      .then((res) => setVideos(res.data.data || []))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="font-heading text-2xl font-bold mb-6">Liked Videos</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      ) : videos.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {videos.map((video, i) => (
            <VideoCard key={video._id} video={video} index={i} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ThumbsUp}
          title="No liked videos yet"
          description="Videos you like will show up here so you can find them again easily."
          actionLabel="Explore videos"
          actionTo="/"
        />
      )}
    </div>
  );
}
