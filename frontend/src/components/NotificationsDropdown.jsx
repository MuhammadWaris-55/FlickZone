import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, ThumbsUp, UserPlus, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

// Placeholder data structure — swap for a real /notifications endpoint once your backend has one
const MOCK_NOTIFICATIONS = [];

export default function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const iconFor = (type) => {
    if (type === "like") return <ThumbsUp size={14} className="text-accent" />;
    if (type === "subscribe")
      return <UserPlus size={14} className="text-accent" />;
    return <MessageCircle size={14} className="text-accent" />;
  };

  return (
    <div className="relative" ref={ref}>
      <motion.button
        whileHover={{ scale: 1.08, rotate: [0, -8, 8, 0] }}
        whileTap={{ scale: 0.92 }}
        transition={{ duration: 0.3 }}
        onClick={() => setOpen((p) => !p)}
        className="relative p-2.5 rounded-full hover:bg-white/[0.06] transition-colors"
      >
        <Bell size={19} />
        {MOCK_NOTIFICATIONS.length > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full ring-2 ring-background" />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            style={{ transformOrigin: "top right" }}
            className="absolute right-0 mt-3 w-80 bg-card/80 backdrop-blur-2xl border border-white/[0.08] rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)] overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <p className="text-sm font-medium">Notifications</p>
            </div>

            {MOCK_NOTIFICATIONS.length === 0 ? (
              <p className="px-4 py-8 text-center text-xs text-muted-foreground">
                You're all caught up — no new notifications.
              </p>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {MOCK_NOTIFICATIONS.map((n) => (
                  <Link
                    key={n._id}
                    to={n.link}
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.05] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center shrink-0 mt-0.5">
                      {iconFor(n.type)}
                    </div>
                    <div>
                      <p className="text-xs">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {n.time}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
