import { X } from "lucide-react";
import { motion } from "framer-motion";
import VideoCard from "@/components/VideoCard";

export default function PlaylistVideoCard({ video, index, onRemove }) {
  return (
    <div className="relative group/playlist">
      <VideoCard video={video} index={index} />
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onRemove(video._id);
        }}
        title="Remove from playlist"
        className="absolute top-2 left-2 z-20 bg-background/80 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover/playlist:opacity-100 transition-opacity hover:bg-destructive/80"
      >
        <X size={14} />
      </motion.button>
    </div>
  );
}
