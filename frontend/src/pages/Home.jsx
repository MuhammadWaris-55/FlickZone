import { useVideos } from "@/hooks/useVideos";
import VideoCard from "@/components/VideoCard";
import VideoCardSkeleton from "@/components/VideoCardSkeleton";

export default function Home() {
  const { videos, loading, error } = useVideos();

  return (
    <div className="p-6">
      <h1 className="font-heading text-2xl font-bold mb-6">Home</h1>

      {error && (
        <p className="text-destructive">Something went wrong loading videos.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <VideoCardSkeleton key={i} />
            ))
          : videos.map((video, i) => (
              <VideoCard key={video._id} video={video} index={i} />
            ))}
      </div>
    </div>
  );
}
