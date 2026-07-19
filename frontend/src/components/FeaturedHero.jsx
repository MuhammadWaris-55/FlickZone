import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Play, Info } from "lucide-react";

export default function FeaturedHero({ video }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax layers move at different speeds as you scroll past the hero
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);

  if (!video) return null;

  return (
    <div
      ref={ref}
      className="relative h-[70vh] min-h-[420px] overflow-hidden rounded-2xl mb-10"
    >
      {/* Background layer — moves slowest */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
      </motion.div>

      {/* Ambient glow layer — moves + scales */}
      <motion.div
        style={{ scale: glowScale }}
        className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-accent/20 blur-[100px] pointer-events-none"
      />

      {/* Content layer — moves fastest, fades on scroll */}
      <motion.div
        style={{ opacity: contentOpacity }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 h-full flex flex-col justify-end p-8 md:p-12 max-w-2xl"
      >
        <span className="text-accent text-xs font-medium tracking-wider uppercase mb-3">
          Featured
        </span>
        <h1 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-3">
          {video.title}
        </h1>
        <p className="text-sm md:text-base text-muted-foreground line-clamp-2 mb-6 max-w-lg">
          {video.description}
        </p>

        <div className="flex items-center gap-3">
          <Link to={`/watch/${video._id}`}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-accent text-accent-foreground font-medium px-6 py-3 rounded-full"
            >
              <Play size={18} fill="currentColor" />
              Watch Now
            </motion.button>
          </Link>
          <Link to={`/watch/${video._id}`}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-card/60 backdrop-blur-md border border-border font-medium px-6 py-3 rounded-full"
            >
              <Info size={18} />
              Details
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
