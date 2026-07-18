import { useState, useEffect } from "react";
import { getAllVideos } from "@/api/videoApi";

export function useVideos(params = {}) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getAllVideos(params)
      .then((data) => {
        if (isMounted) setVideos(data.docs || data); // handles both paginated + plain array shapes
      })
      .catch((err) => {
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [JSON.stringify(params)]);

  return { videos, loading, error };
}