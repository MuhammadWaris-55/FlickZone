import { useState } from "react";
import { motion } from "framer-motion";

export default function FloatingInput({ label, type = "text", value, onChange, name }) {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value?.length > 0;

  return (
    <div className="relative w-full">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full bg-card/60 border border-border rounded-lg px-4 pt-5 pb-2 text-sm outline-none focus:border-accent transition-colors"
      />
      <motion.label
        animate={{
          top: isActive ? 6 : "50%",
          fontSize: isActive ? "11px" : "14px",
          y: isActive ? 0 : "-50%",
          color: focused ? "var(--color-accent)" : "var(--muted-foreground)",
        }}
        transition={{ duration: 0.15 }}
        className="absolute left-4 pointer-events-none font-body"
      >
        {label}
      </motion.label>
    </div>
  );
}