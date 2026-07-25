import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useComments } from "@/hooks/useComments";
import CommentItem from "@/components/CommentItem";

export default function CommentSection({ videoId }) {
  const { comments, setComments, loading, postComment } = useComments(videoId);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    if (!text.trim()) return;
    await postComment(text);
    setText("");
  };

  const handleCommentUpdate = (commentId, newContent) => {
    setComments((prev) =>
      prev.map((c) => (c._id === commentId ? { ...c, content: newContent } : c))
    );
  };

  const handleCommentDelete = (commentId) => {
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  return (
    <div className="mt-6">
      <h3 className="font-heading font-semibold mb-4">
        {comments.length} Comments
      </h3>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 bg-transparent border-b border-border focus:border-accent outline-none py-2 text-sm"
        />
        <button type="submit" className="text-accent text-sm font-medium">
          Comment
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading comments...</p>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {comments.map((comment) => (
            <motion.div
              key={comment._id}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <CommentItem
                comment={comment}
                onUpdate={handleCommentUpdate}
                onDelete={handleCommentDelete}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
