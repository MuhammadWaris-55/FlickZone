import { motion } from "framer-motion";

const PATHS = [
  { d: "M 0 0 L 0 404.609", transform: "translate(370 0)" },
  {
    d: "M 164 0 L 98.814 0 L 0 83.557 L 0 205",
    transform: "translate(400 110)",
  },
  {
    d: "M 0 0 L 56.317 0 C 93.572 34.834 114.632 53.417 155 84.826 L 155 206",
    transform: "translate(181.152 110)",
  },
  { d: "M 0 0 L 295 0 L 295 81", transform: "translate(0 221)" },
  { d: "M 296 0 L 0 0 L 0 79", transform: "translate(438 221)" },
];

const SEGMENT = 0.1;
const GAP = 1 - SEGMENT;

function Tag({ children }) {
  return (
    <div className="max-w-[calc(100%-0.5rem)] border border-white/10 bg-card/50 backdrop-blur-md px-3 py-2 text-center font-body text-xs uppercase tracking-wide text-foreground/80 rounded-md sm:px-4 sm:text-sm md:w-56">
      {children}
    </div>
  );
}

function AnimatedLine({ d, transform }) {
  return (
    <g transform={transform}>
      <path
        d={d}
        stroke="var(--color-accent-mid)"
        strokeOpacity={0.25}
        strokeWidth={2}
      />
      <motion.path
        d={d}
        pathLength={1}
        stroke="var(--color-accent)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeDasharray={`${SEGMENT} ${GAP}`}
        initial={{ strokeDashoffset: 0 }}
        animate={{ strokeDashoffset: -(SEGMENT + GAP) }}
        transition={{
          duration: 2.5,
          ease: "linear",
          repeat: Infinity,
          repeatDelay: 0.3,
        }}
      />
    </g>
  );
}

export default function ConvergingSignals({ labels, centerContent }) {
  // labels: array of 5 strings matching the 5 fixed line positions below
  return (
    <div className="relative w-full max-w-[734px] mx-auto aspect-[734/405]">
      <div className="absolute left-[50.41%] top-0 z-10 w-fit -translate-x-1/2">
        <Tag>{labels[0]}</Tag>
      </div>
      <div className="absolute left-[24.68%] top-[27.16%] z-10 w-fit -translate-x-1/2">
        <Tag>{labels[1]}</Tag>
      </div>
      <div className="absolute left-[76.84%] top-[27.16%] z-10 w-fit max-w-[60%] -translate-x-1/2 sm:max-w-none">
        <Tag>{labels[2]}</Tag>
      </div>
      <div className="absolute left-0 top-[49.57%] z-10 w-fit -translate-x-1/2">
        <Tag>{labels[3]}</Tag>
      </div>
      <div className="absolute left-full top-[49.57%] z-10 w-fit -translate-x-1/2">
        <Tag>{labels[4]}</Tag>
      </div>

      <svg
        viewBox="0 0 734 405"
        className="absolute inset-0 h-full w-full"
        fill="none"
      >
        {PATHS.map((path) => (
          <AnimatedLine key={path.d} {...path} />
        ))}
      </svg>

      <div className="absolute bottom-0 left-[50.41%] size-32 -translate-x-1/2 translate-y-1/2 rounded-2xl bg-accent/10 backdrop-blur-md border border-accent/20 p-1.5 sm:size-28 md:size-36">
        <div className="size-full rounded-xl bg-card/60 backdrop-blur-xl flex items-center justify-center overflow-hidden">
          {centerContent}
        </div>
      </div>
    </div>
  );
}
