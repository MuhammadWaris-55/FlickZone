import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

export default function FloatingInput({
  label,
  type = "text",
  value,
  onChange,
  name,
}) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isActive = focused || value?.length > 0;
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="relative w-full">
      <input
        type={inputType}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full bg-card/60 border border-border rounded-lg px-4 pt-5 pb-2 text-sm outline-none focus:border-accent transition-colors ${
          isPassword ? "pr-10" : ""
        }`}
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

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      )}
    </div>
  );
}
