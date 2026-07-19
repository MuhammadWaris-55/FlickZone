import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toggleVideoLike } from "@/api/likeApi";

export function useLike(videoId, initialLiked = false, initialCount = 0) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);

  const toggleLike = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    // optimistic update
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      await toggleVideoLike(videoId);
    } catch (err) {
      // revert on failure
      setIsLiked((prev) => !prev);
      setLikeCount((prev) => (isLiked ? prev + 1 : prev - 1));
    }
  };

  return { isLiked, likeCount, toggleLike };
}