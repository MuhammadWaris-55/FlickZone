import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
      <motion.div
        animate={{ rotate: [0, 10, -10, 0], y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full scale-125" />
        <div className="relative w-24 h-24 rounded-2xl bg-card/60 backdrop-blur-xl border border-white/[0.08] flex items-center justify-center">
          <Compass size={40} className="text-accent" strokeWidth={1.5} />
        </div>
      </motion.div>

      <h1 className="font-heading text-5xl font-bold mb-2">404</h1>
      <p className="text-muted-foreground mb-6 max-w-sm">
        This page drifted off somewhere. Let's get you back on track.
      </p>

      <Link to="/">
        <motion.span
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-block bg-accent text-accent-foreground text-sm font-medium px-6 py-2.5 rounded-full"
        >
          Back to Home
        </motion.span>
      </Link>
    </div>
  );
}
