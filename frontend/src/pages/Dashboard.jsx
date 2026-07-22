import { motion, AnimatePresence } from "framer-motion";
import { Eye, ThumbsUp, Users, Video as VideoIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useDashboard } from "@/hooks/useDashboard";
import ConvergingSignals from "@/components/ConvergingSignals";
import StatCard from "@/components/StatCard";
import DashboardVideoRow from "@/components/DashboardVideoRow";
import EmptyState from "@/components/EmptyState";

export default function Dashboard() {
  const { user } = useAuth();
  const { stats, videos, loading, removeVideoFromList, updateVideoInList } =
    useDashboard();

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="h-64 rounded-2xl shimmer" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl shimmer" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto pb-16">
      {/* Converging signals hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-10 pt-4"
      >
        <ConvergingSignals
          labels={[
            "Total Views",
            "Subscribers",
            "Total Likes",
            "Videos",
            "Comments",
          ]}
          centerContent={
            <img
              src={user?.avatar}
              alt=""
              className="w-full h-full object-cover"
            />
          }
        />
        <p className="text-center font-heading text-lg font-semibold mt-2">
          {user?.fullName}'s Channel
        </p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard
          icon={Eye}
          label="Total Views"
          value={stats?.totalViews ?? 0}
          index={0}
        />
        <StatCard
          icon={Users}
          label="Subscribers"
          value={stats?.totalSubscribers ?? 0}
          index={1}
        />
        <StatCard
          icon={ThumbsUp}
          label="Total Likes"
          value={stats?.totalLikes ?? 0}
          index={2}
        />
        <StatCard
          icon={VideoIcon}
          label="Videos"
          value={stats?.totalVideos ?? videos.length}
          index={3}
        />
      </div>

      {/* Video management list */}
      <h2 className="font-heading text-xl font-bold mb-4">Your Videos</h2>

      {videos.length === 0 ? (
        <EmptyState
          icon={VideoIcon}
          title="No videos yet"
          description="Upload your first video to start seeing your channel stats here."
          actionLabel="Upload a video"
          actionTo="/upload"
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {videos.map((video) => (
              <DashboardVideoRow
                key={video._id}
                video={video}
                onDelete={removeVideoFromList}
                onToggle={updateVideoInList}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
