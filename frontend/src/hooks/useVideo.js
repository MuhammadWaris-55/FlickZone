import { useState, useEffect } from "react";
import { getVideoById } from "@/api/videoApi";

export function useVideo(videoId) {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getVideoById(videoId)
      .then(setVideo)
      .catch(() => setVideo(null))
      .finally(() => setLoading(false));
  }, [videoId]);

  return { video, loading };
}