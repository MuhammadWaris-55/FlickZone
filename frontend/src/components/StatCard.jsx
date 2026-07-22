import { useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import CountUp from "@/components/CountUp";

export default function StatCard({
  icon: Icon,
  label,
  value,
  index = 0,
  trend,
}) {
  const ref = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      style={{ perspective: 800 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative bg-card/40 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 overflow-hidden group hover:border-accent/30 transition-colors duration-300"
      >
        <div className="absolute -top-8 -right-8 w-28 h-28 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-colors duration-300" />

        <div style={{ transform: "translateZ(25px)" }} className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
              <Icon size={19} className="text-accent" strokeWidth={1.8} />
            </div>
            {trend != null && (
              <span
                className={`text-xs font-medium ${trend >= 0 ? "text-accent" : "text-destructive"}`}
              >
                {trend >= 0 ? "+" : ""}
                {trend}%
              </span>
            )}
          </div>
          <p className="font-heading text-2xl font-bold">
            <CountUp value={value} />
          </p>
          <p className="text-xs text-muted-foreground mt-1">{label}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
