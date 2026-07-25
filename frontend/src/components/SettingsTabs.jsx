import { motion } from "framer-motion";

const TABS = ["Profile", "Security"];

export default function SettingsTabs({ activeTab, onTabChange }) {
  return (
    <div className="relative flex border-b border-border mb-6 gap-2">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`relative px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === tab
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground/80"
          }`}
        >
          {tab}
          {activeTab === tab && (
            <motion.div
              layoutId="settings-tab-indicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
