import { motion } from "framer-motion";
import CountUp from "@/components/CountUp";

export default function StatCard({ icon: Icon, label, value, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="relative bg-card/40 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 overflow-hidden group"
    >
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-colors duration-300" />
      <div className="relative flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
          <Icon size={19} className="text-accent" strokeWidth={1.8} />
        </div>
      </div>
      <p className="font-heading text-2xl font-bold relative">
        <CountUp value={value} />
      </p>
      <p className="text-xs text-muted-foreground mt-1 relative">{label}</p>
    </motion.div>
  );
}
