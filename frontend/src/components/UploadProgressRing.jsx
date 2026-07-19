import { motion } from "framer-motion";

export default function UploadProgressRing({ progress }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg width="96" height="96" className="-rotate-90">
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="var(--color-border)"
          strokeWidth="6"
          fill="none"
        />
        <motion.circle
          cx="48"
          cy="48"
          r={radius}
          stroke="var(--color-accent)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </svg>
      <span className="absolute font-heading text-lg font-bold">
        {progress}%
      </span>
    </div>
  );
}
