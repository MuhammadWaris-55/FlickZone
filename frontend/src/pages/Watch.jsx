import { useParams } from "react-router-dom";
import { useVideo } from "@/hooks/useVideo";
import LikeButton from "@/components/LikeButton";
import SubscribeButton from "@/components/SubscribeButton";
import CommentSection from "@/components/CommentSection";

export default function Watch() {
  const { videoId } = useParams();
  const { video, loading } = useVideo(videoId);

  if (loading) return <p className="p-6">Loading video...</p>;
  if (!video) return <p className="p-6">Video not found.</p>;

  return (
    <div className="p-6 max-w-4xl">
      <video
        src={video.videoFile}
        controls
        className="w-full rounded-xl bg-black aspect-video"
      />

      <h1 className="font-heading text-xl font-bold mt-4">{video.title}</h1>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3">
          <img src={video.owner?.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <p className="font-medium text-sm">{video.owner?.username}</p>
            <p className="text-xs text-muted-foreground">{video.owner?.subscribersCount ?? 0} subscribers</p>
          </div>
          <SubscribeButton channelId={video.owner?._id} initialSubscribed={video.owner?.isSubscribed} />
        </div>

        <LikeButton videoId={video._id} initialLiked={video.isLiked} initialCount={video.likesCount} />
      </div>

      <p className="text-sm text-muted-foreground mt-4">{video.description}</p>

      <CommentSection videoId={video._id} />
    </div>
  );
}