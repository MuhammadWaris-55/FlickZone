import { useVideos } from "@/hooks/useVideos";
import VideoCard from "@/components/VideoCard";
import VideoCardSkeleton from "@/components/VideoCardSkeleton";
import FeaturedCarousel from "@/components/FeaturedCarousel";

export default function Home() {
  const { videos, loading, error } = useVideos();

  const sortedByViews = [...videos].sort((a, b) => b.views - a.views);
  const featuredVideos = sortedByViews.slice(0, 5);
  const featuredIds = new Set(featuredVideos.map((v) => v._id));
  const gridVideos = videos.filter((v) => !featuredIds.has(v._id));

  return (
    <div className="p-6">
      {!loading && featuredVideos.length > 0 && (
        <FeaturedCarousel videos={featuredVideos} />
      )}

      <h1 className="font-heading text-2xl font-bold mb-6">
        {loading ? "Home" : "Trending Now"}
      </h1>

      {error && (
        <p className="text-destructive">Something went wrong loading videos.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <VideoCardSkeleton key={i} />
            ))
          : gridVideos.map((video, i) => (
              <VideoCard key={video._id} video={video} index={i} />
            ))}
      </div>
    </div>
  );
}
