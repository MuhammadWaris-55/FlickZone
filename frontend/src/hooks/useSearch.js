import { useState, useEffect } from "react";
import { searchVideos } from "@/api/videoApi";

export function useSearch(query) {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!query) {
            setResults([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        searchVideos(query)
            .then((data) => setResults(data.docs || data || []))
            .catch(() => setResults([]))
            .finally(() => setLoading(false));
    }, [query]);

    return { results, loading };
}