import { useState, useEffect, useCallback } from "react";
import { getAllVideos } from "@/api/videoApi";

export function useVideos(limit = 12) {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getAllVideos({ page: 1, limit })
      .then((data) => {
        setVideos(data.docs || []);
        setHasMore(data.hasNextPage ?? false);
        setPage(1);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [limit]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await getAllVideos({ page: nextPage, limit });
      setVideos((prev) => [...prev, ...(data.docs || [])]);
      setHasMore(data.hasNextPage ?? false);
      setPage(nextPage);
    } finally {
      setLoadingMore(false);
    }
  }, [page, limit, hasMore, loadingMore]);

  return { videos, loading, error, loadMore, hasMore, loadingMore };
}