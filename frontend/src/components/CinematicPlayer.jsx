import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function CinematicPlayer({ video }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative">
      {/* Ambient glow that pulses subtly while playing */}
      <motion.div
        animate={{
          opacity: isPlaying ? [0.3, 0.5, 0.3] : 0.15,
          scale: isPlaying ? [1, 1.05, 1] : 1,
        }}
        transition={{ duration: 4, repeat: isPlaying ? Infinity : 0, ease: "easeInOut" }}
        className="absolute -inset-6 bg-gradient-to-br from-accent/40 via-accent-mid/30 to-transparent blur-[60px] rounded-3xl pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative rounded-2xl overflow-hidden border border-border shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]"
      >
        <video
          ref={videoRef}
          src={video.videoFile}
          controls
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="w-full aspect-video bg-black"
        />
      </motion.div>
    </div>
  );
}