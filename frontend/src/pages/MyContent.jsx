import { useEffect, useState } from "react";
import { Video } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getVideosByOwner } from "@/api/videoApi";
import EmptyState from "@/components/EmptyState";
import VideoCard from "@/components/VideoCard";
import VideoCardSkeleton from "@/components/VideoCardSkeleton";

export default function MyContent() {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      getVideosByOwner(user._id)
        .then((data) => setVideos(data.docs || data || []))
        .catch(() => setVideos([]))
        .finally(() => setLoading(false));
    }
  }, [user?._id]);

  return (
    <div className="p-6">
      <h1 className="font-heading text-2xl font-bold mb-6">My Content</h1>

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
          icon={Video}
          title="You haven't uploaded anything yet"
          description="Share your first video with the world — it only takes a minute."
          actionLabel="Upload a video"
          actionTo="/upload"
        />
      )}
    </div>
  );
}