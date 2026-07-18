import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { formatViews } from "@/utils/formatViews";
import { timeAgo } from "@/utils/timeAgo";
import { formatDuration } from "@/utils/formatDuration";

export default function VideoCard({ video, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.05, ease: "easeOut" }}
    >
      <Link
        to={`/watch/${video._id}`}
        className="group block rounded-xl overflow-hidden bg-card border border-border transition-colors hover:border-accent/50"
      >
        <div className="relative aspect-video overflow-hidden bg-accent-deep">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {video.duration != null && (
            <span className="absolute bottom-2 right-2 bg-background/80 text-foreground text-xs px-1.5 py-0.5 rounded">
              {formatDuration(video.duration)}
            </span>
          )}
        </div>

        <div className="p-3 flex gap-3">
          {video.owner?.avatar && (
            <img
              src={video.owner.avatar}
              alt={video.owner.username}
              className="w-9 h-9 rounded-full object-cover shrink-0"
            />
          )}
          <div className="min-w-0">
            <h3 className="font-body font-medium text-sm line-clamp-2 leading-snug">
              {video.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {video.owner?.username}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatViews(video.views)} · {timeAgo(video.createdAt)}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
