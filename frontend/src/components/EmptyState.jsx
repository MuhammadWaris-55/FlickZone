import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionTo }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center text-center py-20 px-6"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full scale-125" />
        <div className="relative w-20 h-20 rounded-2xl bg-card/60 backdrop-blur-xl border border-white/[0.08] flex items-center justify-center">
          <Icon size={32} className="text-accent" strokeWidth={1.5} />
        </div>
      </motion.div>

      <h3 className="font-heading text-lg font-bold mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6">{description}</p>

      {actionLabel && actionTo && (
        <Link to={actionTo}>
          <motion.span
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block bg-accent text-accent-foreground text-sm font-medium px-5 py-2.5 rounded-full"
          >
            {actionLabel}
          </motion.span>
        </Link>
      )}
    </motion.div>
  );
}