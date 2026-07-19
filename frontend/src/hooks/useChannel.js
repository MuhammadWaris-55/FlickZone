import { useState, useEffect } from "react";
import { getChannelProfile } from "@/api/userApi";

export function useChannel(username) {
    const [channel, setChannel] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getChannelProfile(username)
            .then(setChannel)
            .catch(() => setChannel(null))
            .finally(() => setLoading(false));
    }, [username]);

    return { channel, loading };
}