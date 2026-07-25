import { useState } from "react";
import { motion } from "framer-motion";
import { createTweet } from "@/api/tweetApi";

export default function CreateTweetBox({ onCreated }) {
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setPosting(true);
    try {
      const tweet = await createTweet(content);
      onCreated(tweet);
      setContent("");
    } finally {
      setPosting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card/40 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 mb-4"
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share something with your subscribers..."
        rows={3}
        className="w-full bg-background/60 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent transition-colors resize-none"
      />
      <div className="flex justify-end mt-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={posting || !content.trim()}
          className="bg-accent text-accent-foreground text-sm font-medium px-5 py-2 rounded-full disabled:opacity-50"
        >
          {posting ? "Posting..." : "Post"}
        </motion.button>
      </div>
    </form>
  );
}
