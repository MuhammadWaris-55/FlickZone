import { motion } from "framer-motion";

export default function AppLoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center overflow-hidden z-[100]">
      {/* Ambient glow blobs, same language as rest of app */}
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[10%] w-[400px] h-[400px] rounded-full bg-accent/15 blur-[110px]"
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 60, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] right-[10%] w-[350px] h-[350px] rounded-full bg-accent-mid/20 blur-[110px]"
      />

      {/* Logo mark with pulsing glow ring */}
      <div className="relative flex items-center justify-center mb-6">
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-20 h-20 rounded-full bg-accent/30 blur-xl"
        />
        <motion.img
          src="/logo-mark.svg"
          alt=""
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative w-12 h-12 z-10"
        />
      </div>

      {/* Wordmark */}
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="font-heading text-xl font-bold tracking-tight mb-6"
      >
        FlickZone
      </motion.h1>

      {/* Animated progress dots */}
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
            className="w-1.5 h-1.5 rounded-full bg-accent"
          />
        ))}
      </div>
    </div>
  );
}
