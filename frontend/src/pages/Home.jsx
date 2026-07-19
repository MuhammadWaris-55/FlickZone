import { useVideos } from "@/hooks/useVideos";
import VideoCard from "@/components/VideoCard";
import VideoCardSkeleton from "@/components/VideoCardSkeleton";
import FeaturedHero from "@/components/FeaturedHero";

export default function Home() {
  const { videos, loading, error } = useVideos();
  const featuredVideo = videos[0]; // later: pick by most views, or a backend "featured" flag
  const gridVideos = videos.slice(1);

  return (
    <div className="p-6">
      {!loading && featuredVideo && <FeaturedHero video={featuredVideo} />}

      <h1 className="font-heading text-2xl font-bold mb-6">
        {loading ? "Home" : "Trending Now"}
      </h1>

      {error && (
        <p className="text-destructive">Something went wrong loading videos.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <VideoCardSkeleton key={i} />)
          : gridVideos.map((video, i) => (
              <VideoCard key={video._id} video={video} index={i} />
            ))}
      </div>
    </div>
  );
}