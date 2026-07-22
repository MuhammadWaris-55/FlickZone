import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MoreVertical, Trash2, Eye, EyeOff } from "lucide-react";
import { formatViews } from "@/utils/formatViews";
import { formatDuration } from "@/utils/formatDuration";
import { timeAgo } from "@/utils/timeAgo";
import axiosInstance from "@/api/axiosInstance";

export default function DashboardVideoRow({ video, onDelete, onToggle }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this video permanently?")) return;
    setBusy(true);
    try {
      await axiosInstance.delete(`/videos/${video._id}`);
      onDelete(video._id);
    } finally {
      setBusy(false);
    }
  };

  const handleTogglePublish = async () => {
    setBusy(true);
    try {
      await axiosInstance.patch(`/videos/toggle/publish/${video._id}`);
      onToggle(video._id, { isPublished: !video.isPublished });
    } finally {
      setBusy(false);
      setMenuOpen(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: busy ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-center gap-4 bg-card/40 backdrop-blur-xl border border-white/[0.06] rounded-xl p-3 hover:border-accent/30 transition-colors"
    >
      <Link
        to={`/watch/${video._id}`}
        className="relative w-32 aspect-video shrink-0 rounded-lg overflow-hidden"
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <span className="absolute bottom-1 right-1 bg-background/80 text-[10px] px-1 rounded">
          {formatDuration(video.duration)}
        </span>
      </Link>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{video.title}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatViews(video.views)} · {timeAgo(video.createdAt)}
        </p>
        <span
          className={`inline-flex items-center gap-1 text-[11px] mt-1.5 px-2 py-0.5 rounded-full ${
            video.isPublished
              ? "bg-accent/15 text-accent"
              : "bg-white/[0.06] text-muted-foreground"
          }`}
        >
          {video.isPublished ? <Eye size={11} /> : <EyeOff size={11} />}
          {video.isPublished ? "Published" : "Private"}
        </span>
      </div>

      <div className="relative">
        <button
          onClick={() => setMenuOpen((p) => !p)}
          className="p-2 rounded-full hover:bg-white/[0.06] transition-colors"
        >
          <MoreVertical size={17} />
        </button>

        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-0 mt-1 w-44 bg-card/80 backdrop-blur-2xl border border-white/[0.08] rounded-lg shadow-xl overflow-hidden z-20"
          >
            <button
              onClick={handleTogglePublish}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-xs hover:bg-white/[0.05] transition-colors"
            >
              {video.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
              {video.isPublished ? "Make Private" : "Publish"}
            </button>
            <button
              onClick={handleDelete}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 size={14} /> Delete
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
