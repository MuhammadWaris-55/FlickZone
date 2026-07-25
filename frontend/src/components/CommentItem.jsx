import { useState } from "react";
import { motion } from "framer-motion";
import { MoreVertical, Pencil, Trash2, Check, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { timeAgo } from "@/utils/timeAgo";
import { updateComment, deleteComment } from "@/api/commentApi";

export default function CommentItem({ comment, onUpdate, onDelete }) {
  const { user } = useAuth();
  const isOwner = user?._id === comment.owner?._id;

  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [busy, setBusy] = useState(false);

  const handleSaveEdit = async () => {
    if (!editText.trim()) return;
    setBusy(true);
    try {
      await updateComment(comment._id, editText);
      onUpdate(comment._id, editText);
      setEditing(false);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this comment?")) return;
    setBusy(true);
    try {
      await deleteComment(comment._id);
      onDelete(comment._id);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex gap-3 py-3 group/comment">
      <img
        src={comment.owner?.avatar}
        alt={comment.owner?.username}
        className="w-9 h-9 rounded-full object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{comment.owner?.username}</span>
          <span className="text-xs text-muted-foreground">
            {timeAgo(comment.createdAt)}
          </span>
        </div>

        {editing ? (
          <div className="mt-1.5 flex items-center gap-2">
            <input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              autoFocus
              className="flex-1 bg-transparent border-b border-accent outline-none text-sm py-1"
            />
            <button
              onClick={handleSaveEdit}
              disabled={busy}
              className="text-accent hover:opacity-80"
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setEditText(comment.content);
              }}
              className="text-muted-foreground hover:opacity-80"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <p className="text-sm mt-1">{comment.content}</p>
        )}
      </div>

      {isOwner && !editing && (
        <div className="relative shrink-0 opacity-0 group-hover/comment:opacity-100 transition-opacity">
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
  );
}
