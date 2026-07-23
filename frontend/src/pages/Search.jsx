import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SearchX } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import VideoCard from "@/components/VideoCard";
import VideoCardSkeleton from "@/components/VideoCardSkeleton";
import EmptyState from "@/components/EmptyState";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { results, loading } = useSearch(query);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div
        key={query}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <h1 className="font-heading text-2xl font-bold">
          Results for <span className="text-accent">"{query}"</span>
        </h1>
        {!loading && (
          <p className="text-sm text-muted-foreground mt-1">
            {results.length} {results.length === 1 ? "video" : "videos"} found
          </p>
        )}
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      ) : results.length ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={query}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {results.map((video, i) => (
              <VideoCard key={video._id} video={video} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      ) : (
        <EmptyState
          icon={SearchX}
          title={`No results for "${query}"`}
          description="Try different keywords or check for typos."
          actionLabel="Browse all videos"
          actionTo="/"
        />
      )}
    </div>
  );
}
