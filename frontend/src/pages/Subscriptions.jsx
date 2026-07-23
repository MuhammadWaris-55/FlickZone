import { Users } from "lucide-react";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import ChannelAvatarRow from "@/components/ChannelAvatarRow";
import VideoCard from "@/components/VideoCard";
import VideoCardSkeleton from "@/components/VideoCardSkeleton";
import EmptyState from "@/components/EmptyState";

export default function Subscriptions() {
  const { channels, videos, loading } = useSubscriptions();

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex gap-4 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-14 h-14 rounded-full shimmer shrink-0" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (channels.length === 0) {
    return (
      <div className="p-6">
        <h1 className="font-heading text-2xl font-bold mb-6">Subscriptions</h1>
        <EmptyState
          icon={Users}
          title="No subscriptions yet"
          description="Subscribe to channels you like and their latest videos will show up here."
          actionLabel="Discover channels"
          actionTo="/"
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="font-heading text-2xl font-bold mb-5">Subscriptions</h1>

      <ChannelAvatarRow channels={channels} />

      {videos.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No videos yet"
          description="The channels you're subscribed to haven't posted anything yet."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {videos.map((video, i) => (
            <VideoCard key={video._id} video={video} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
