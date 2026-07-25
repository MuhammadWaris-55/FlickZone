import { motion } from "framer-motion";
import { useState } from "react";
import CustomVideoPlayer from "@/components/CustomVideoPlayer";

export default function CinematicPlayer({ video }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative">
      <motion.div
        animate={{
          opacity: isPlaying ? [0.3, 0.5, 0.3] : 0.15,
          scale: isPlaying ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: 4,
          repeat: isPlaying ? Infinity : 0,
          ease: "easeInOut",
        }}
        className="absolute -inset-6 bg-gradient-to-br from-accent/40 via-accent-mid/30 to-transparent blur-[60px] rounded-3xl pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative rounded-2xl overflow-hidden border border-border shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]"
      >
        <CustomVideoPlayer src={video.videoFile} />
      </motion.div>
    </div>
  );
}
