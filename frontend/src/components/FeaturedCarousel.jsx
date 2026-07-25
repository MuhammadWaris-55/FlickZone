import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";

export default function FeaturedCarousel({ videos }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef(null);

  const goTo = useCallback(
    (newIndex, dir) => {
      setDirection(dir);
      setIndex((newIndex + videos.length) % videos.length);
    },
    [videos.length]
  );

  const next = useCallback(() => goTo(index + 1, 1), [index, goTo]);
  const prev = useCallback(() => goTo(index - 1, -1), [index, goTo]);

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % videos.length);
    }, 2000);
    return () => clearTimeout(timerRef.current);
  }, [index, videos.length]);

  const handleManualNav = (fn) => {
    clearTimeout(timerRef.current);
    fn();
  };

  const video = videos[index];
  if (!video) return null;

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60, scale: 1.02 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60, scale: 0.98 }),
  };

  return (
    <div className="relative h-[70vh] min-h-[420px] overflow-hidden rounded-2xl mb-10 group">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={video._id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            className="absolute inset-0 w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

          <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-12 max-w-2xl">
            <span className="text-accent text-xs font-medium tracking-wider uppercase mb-3">
              Trending #{index + 1}
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
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={() => handleManualNav(prev)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-background/50 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/80"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => handleManualNav(next)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-background/50 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/80"
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-5 right-8 z-20 flex gap-2">
        {videos.map((_, i) => (
          <button
            key={i}
            onClick={() => handleManualNav(() => goTo(i, i > index ? 1 : -1))}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index
                ? "w-6 bg-accent"
                : "w-1.5 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
