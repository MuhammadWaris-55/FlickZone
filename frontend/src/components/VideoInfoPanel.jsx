import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import LikeButton from "@/components/LikeButton";
import SubscribeButton from "@/components/SubscribeButton";
import AddToPlaylistButton from "@/components/AddToPlaylistButton";

export default function VideoInfoPanel({ video }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
      className="relative bg-card/40 backdrop-blur-xl border border-border rounded-2xl p-5 mt-5"
    >
      <h1 className="font-heading text-xl md:text-2xl font-bold">
        {video.title}
      </h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
        <div className="flex items-center gap-3">
          <Link to={`/channel/${video.owner?.username}`}>
            <motion.img
              whileHover={{ scale: 1.08 }}
              src={video.owner?.avatar}
              alt=""
              className="w-11 h-11 rounded-full object-cover ring-2 ring-accent/30"
            />
          </Link>
          <div>
            <Link
              to={`/channel/${video.owner?.username}`}
              className="font-medium text-sm hover:text-accent transition-colors"
            >
              {video.owner?.username}
            </Link>
            <p className="text-xs text-muted-foreground">
              {video.owner?.subscribersCount ?? 0} subscribers
            </p>
          </div>
          <SubscribeButton
            channelId={video.owner?._id}
            initialSubscribed={video.owner?.isSubscribed}
          />
        </div>

        <div className="flex items-center gap-2">
          <LikeButton
            videoId={video._id}
            initialLiked={video.isLiked}
            initialCount={video.likesCount}
          />
          <AddToPlaylistButton videoId={video._id} />
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-muted-foreground mt-4 leading-relaxed border-t border-border pt-4"
      >
        {video.description}
      </motion.p>
    </motion.div>
  );
}
