import { motion } from "framer-motion";

export default function AuthCard({ children, shake = false, wide = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        x: shake ? [0, -8, 8, -6, 6, 0] : 0,
      }}
      transition={{ duration: shake ? 0.4 : 0.5, ease: "easeOut" }}
      className={`w-full ${wide ? "max-w-md" : "max-w-sm"} bg-card/40 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-2xl`}
    >
      {children}
    </motion.div>
  );
}
