import { motion, AnimatePresence } from "framer-motion";
import { Eye, ThumbsUp, Users, Video as VideoIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useDashboard } from "@/hooks/useDashboard";
import StatCard from "@/components/StatCard";
import ViewsChart from "@/components/ViewsChart";
import EngagementDonut from "@/components/EngagementDonut";
import DashboardVideoRow from "@/components/DashboardVideoRow";
import EmptyState from "@/components/EmptyState";

export default function Dashboard() {
  const { user } = useAuth();
  const { stats, videos, loading, removeVideoFromList, updateVideoInList } =
    useDashboard();

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl shimmer" />
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="h-72 rounded-2xl shimmer" />
          <div className="h-72 rounded-2xl shimmer" />
        </div>
      </div>
    );
  }

  // Placeholder shape until your backend returns real time-series data —
  // swap this for stats.viewsOverTime once that endpoint exists
  const viewsData = stats?.viewsOverTime ?? [
    { day: "Mon", views: 12 },
    { day: "Tue", views: 19 },
    { day: "Wed", views: 8 },
    { day: "Thu", views: 25 },
    { day: "Fri", views: 17 },
    { day: "Sat", views: 30 },
    { day: "Sun", views: 22 },
  ];

  const engagementData = [
  { name: "Likes", value: stats?.totalLikes ?? 0 },
  { name: "Comments", value: stats?.totalComments ?? 2 },
  { name: "Subscribers", value: stats?.totalSubscribers ?? 0 },
];

  return (
    <div className="p-6 max-w-5xl mx-auto pb-16 relative">
      {/* Ambient glow anchor behind the whole dashboard */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-accent/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8 pt-2"
      >
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={user?.avatar}
          alt=""
          className="w-14 h-14 rounded-full object-cover ring-2 ring-accent/30"
        />
        <div>
          <h1 className="font-heading text-xl font-bold">
            Your Dashboard
          </h1>
          <p className="text-xs text-muted-foreground">
            Overview of your channel's performance
          </p>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-5 mb-10">
        <ViewsChart data={viewsData} />
        <EngagementDonut data={engagementData} />
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
