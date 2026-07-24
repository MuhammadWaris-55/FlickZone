import { useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import { ListVideo } from "lucide-react";

export default function PlaylistCard({ playlist, index = 0 }) {
  const ref = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 200,
    damping: 20,
  });

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const thumbnail = playlist.thumbnail;
  const videoCount = playlist.totalVideos ?? 0;

  // const thumbnail = playlist.videos?.[0]?.thumbnail;
  // const videoCount = playlist.videos?.length ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      style={{ perspective: 1000 }}
    >
      <Link to={`/playlist/${playlist._id}`}>
        <motion.div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative cursor-pointer"
        >
          {/* Back stacked layers — create the "deck" illusion */}
          <div
            style={{
              transform: "translateZ(-20px) translateY(6px) scale(0.96)",
            }}
            className="absolute inset-0 rounded-xl bg-accent-deep/60 border border-white/[0.04]"
          />
          <div
            style={{
              transform: "translateZ(-10px) translateY(3px) scale(0.98)",
            }}
            className="absolute inset-0 rounded-xl bg-accent-mid/40 border border-white/[0.06]"
          />

          {/* Front card */}
          <div
            style={{ transform: "translateZ(0px)" }}
            className="relative aspect-video rounded-xl overflow-hidden bg-card border border-border group"
          >
            {thumbnail ? (
              <img
                src={thumbnail}
                alt=""
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-accent-deep">
                <ListVideo size={32} className="text-muted-foreground" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium truncate">{playlist.name}</p>
                <p className="text-xs text-muted-foreground">
                  {videoCount} videos
                </p>
              </div>
              <div className="flex items-center gap-1 bg-background/70 backdrop-blur-sm px-2 py-1 rounded-md">
                <ListVideo size={13} />
                <span className="text-xs">{videoCount}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
