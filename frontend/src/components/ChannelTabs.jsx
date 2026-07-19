import { motion } from "framer-motion";

const TABS = ["Videos", "Playlists", "Tweets", "Subscribed"];

export default function ChannelTabs({ activeTab, onTabChange }) {
  return (
    <div className="relative flex border-b border-border mt-6 px-6 gap-2 overflow-x-auto">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
            activeTab === tab
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground/80"
          }`}
        >
          {tab}
          {activeTab === tab && (
            <motion.div
              layoutId="channel-tab-indicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
