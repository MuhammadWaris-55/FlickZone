import { useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { formatViews } from "@/utils/formatViews";
import { timeAgo } from "@/utils/timeAgo";
import { formatDuration } from "@/utils/formatDuration";

export default function VideoCard({ video, index = 0 }) {
  const ref = useRef(null);
  const navigate = useNavigate();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 200,
    damping: 20,
  });
  const glowX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.05, ease: "easeOut" }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => navigate(`/watch/${video._id}`)}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative rounded-xl overflow-hidden bg-card border border-border transition-shadow duration-300 hover:shadow-[0_20px_50px_-12px_var(--color-accent)] cursor-pointer"
      >
        {/* Cursor-tracking glow */}
        <motion.div
          style={{
            background: `radial-gradient(circle at ${glowX} ${glowY}, var(--color-accent) 0%, transparent 60%)`,
          }}
          className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-300 pointer-events-none z-10"
        />

        <div
          className="relative aspect-video overflow-hidden bg-accent-deep"
          style={{ transform: "translateZ(20px)" }}
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {video.duration != null && (
            <span className="absolute bottom-2 right-2 bg-background/80 text-foreground text-xs px-1.5 py-0.5 rounded backdrop-blur-sm">
              {formatDuration(video.duration)}
            </span>
          )}
        </div>

        <div
          className="p-3 flex gap-3 relative z-10"
          style={{ transform: "translateZ(10px)" }}
        >
          {video.owner?.avatar && (
            <Link
              to={`/channel/${video.owner.username}`}
              onClick={(e) => e.stopPropagation()}
              className="shrink-0"
            >
              <img
                src={video.owner.avatar}
                alt={video.owner.username}
                className="w-9 h-9 rounded-full object-cover ring-1 ring-border hover:ring-accent transition-colors"
              />
            </Link>
          )}
          <div className="min-w-0">
            <h3 className="font-body font-medium text-sm line-clamp-2 leading-snug">
              {video.title}
            </h3>
            <Link
              to={`/channel/${video.owner?.username}`}
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-muted-foreground mt-1 truncate hover:text-accent transition-colors block w-fit"
            >
              {video.owner?.username}
            </Link>
            <p className="text-xs text-muted-foreground">
              {formatViews(video.views)} · {timeAgo(video.createdAt)}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
