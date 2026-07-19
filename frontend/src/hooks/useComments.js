import { useState, useEffect } from "react";
import { getVideoComments, addComment } from "@/api/commentApi";

export function useComments(videoId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVideoComments(videoId)
      .then((data) => setComments(data.docs || data))
      .finally(() => setLoading(false));
  }, [videoId]);

  const postComment = async (content) => {
    const newComment = await addComment(videoId, content);
    setComments((prev) => [newComment, ...prev]);
  };

  return { comments, loading, postComment };
}