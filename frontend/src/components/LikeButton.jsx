import { motion } from "framer-motion";
import { ThumbsUp } from "lucide-react";
import { useLike } from "@/hooks/useLike";

export default function LikeButton({ videoId, initialLiked, initialCount }) {
  const { isLiked, likeCount, toggleLike } = useLike(videoId, initialLiked, initialCount);

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleLike}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
        isLiked ? "bg-accent text-accent-foreground border-accent" : "border-border hover:bg-accent/20"
      }`}
    >
      <ThumbsUp size={18} fill={isLiked ? "currentColor" : "none"} />
      <span className="text-sm font-body">{likeCount}</span>
    </motion.button>
  );
}