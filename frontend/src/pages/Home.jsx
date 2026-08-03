import { useEffect, useRef } from "react";
import { useVideos } from "@/hooks/useVideos";
import VideoCard from "@/components/VideoCard";
import VideoCardSkeleton from "@/components/VideoCardSkeleton";
import FeaturedCarousel from "@/components/FeaturedCarousel";

export default function Home() {
  const { videos, loading, error, loadMore, hasMore, loadingMore } =
    useVideos();
  const sentinelRef = useRef(null);

  const sortedByViews = [...videos].sort((a, b) => b.views - a.views);
  const featuredVideos = sortedByViews.slice(0, 5);

  // Infinite scroll: load more when the sentinel div scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.5 }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [loadMore, hasMore, loadingMore]);

  return (
    <div className="p-6">
      {!loading && featuredVideos.length > 0 && (
        <FeaturedCarousel videos={featuredVideos} />
      )}

      <h1 className="font-heading text-2xl font-bold mb-6">
        {loading ? "Home" : "All Videos"}
      </h1>

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

        {loadingMore &&
          Array.from({ length: 4 }).map((_, i) => (
            <VideoCardSkeleton key={`more-${i}`} />
          ))}
      </div>

      {/* Invisible trigger element — when scrolled into view, loads next page */}
      {hasMore && <div ref={sentinelRef} className="h-1" />}
    </div>
  );
}
