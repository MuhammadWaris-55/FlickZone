import { useState } from "react";
import { motion } from "framer-motion";
import { MoreVertical, Pencil, Trash2, Check, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { timeAgo } from "@/utils/timeAgo";
import { updateTweet, deleteTweet } from "@/api/tweetApi";

export default function TweetItem({ tweet, onUpdate, onDelete }) {
  const { user } = useAuth();
  const isOwner = user?._id === tweet.ownerDetails?._id;

  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(tweet.content);
  const [busy, setBusy] = useState(false);

  const handleSaveEdit = async () => {
    if (!editText.trim()) return;
    setBusy(true);
    try {
      await updateTweet(tweet._id, editText);
      onUpdate(tweet._id, editText);
      setEditing(false);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    setBusy(true);
    try {
      await deleteTweet(tweet._id);
      onDelete(tweet._id);
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-card/40 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 group/tweet"
    >
      <div className="flex items-start gap-3">
        <img
          src={tweet.ownerDetails?.avatar}
          alt=""
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {tweet.ownerDetails?.username}
            </span>
            <span className="text-xs text-muted-foreground">
              {timeAgo(tweet.createdAt)}
            </span>
          </div>

          {editing ? (
            <div className="mt-2 space-y-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                autoFocus
                rows={3}
                className="w-full bg-background/60 border border-accent rounded-lg px-3 py-2 text-sm outline-none resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  disabled={busy}
                  className="flex items-center gap-1 text-xs bg-accent text-accent-foreground px-3 py-1.5 rounded-full"
                >
                  <Check size={13} /> Save
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setEditText(tweet.content);
                  }}
                  className="flex items-center gap-1 text-xs border border-border px-3 py-1.5 rounded-full"
                >
                  <X size={13} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm mt-1.5 whitespace-pre-wrap">
              {tweet.content}
            </p>
          )}
        </div>

        {isOwner && !editing && (
          <div className="relative shrink-0 opacity-0 group-hover/tweet:opacity-100 transition-opacity">
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="p-1.5 rounded-full hover:bg-white/[0.06] transition-colors"
            >
              <MoreVertical size={15} />
            </button>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMenuOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-0 mt-1 w-36 bg-card/95 backdrop-blur-2xl border border-white/[0.08] rounded-lg shadow-2xl overflow-hidden z-50"
                >
                  <button
                    onClick={() => {
                      setEditing(true);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-white/[0.05] transition-colors"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </motion.div>
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
