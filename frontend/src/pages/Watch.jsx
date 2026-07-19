import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useVideo } from "@/hooks/useVideo";
import CinematicPlayer from "@/components/CinematicPlayer";
import VideoInfoPanel from "@/components/VideoInfoPanel";
import CommentSection from "@/components/CommentSection";

export default function Watch() {
  const { videoId } = useParams();
  const { video, loading } = useVideo(videoId);

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="aspect-video rounded-2xl shimmer" />
        <div className="mt-5 space-y-3">
          <div className="h-6 w-2/3 rounded shimmer" />
          <div className="h-4 w-1/3 rounded shimmer" />
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center py-20">
        <p className="text-muted-foreground">Video not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <CinematicPlayer video={video} />
      <VideoInfoPanel video={video} />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <CommentSection videoId={video._id} />
      </motion.div>
    </div>
  );
}