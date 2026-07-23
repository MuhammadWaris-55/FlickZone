import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserPlaylists, createPlaylist as createPlaylistApi, deletePlaylist as deletePlaylistApi } from "@/api/playlistApi";

export function usePlaylists() {
    const { user } = useAuth();
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPlaylists = () => {
        if (!user?._id) return;
        setLoading(true);
        getUserPlaylists(user._id)
            .then((data) => setPlaylists(data || []))
            .catch(() => setPlaylists([]))
            .finally(() => setLoading(false));
    };

    useEffect(fetchPlaylists, [user?._id]);

    const createPlaylist = async (name, description) => {
        const newPlaylist = await createPlaylistApi(name, description);
        setPlaylists((prev) => [newPlaylist, ...prev]);
    };

    const removePlaylist = async (playlistId) => {
        await deletePlaylistApi(playlistId);
        setPlaylists((prev) => prev.filter((p) => p._id !== playlistId));
    };

    return { playlists, loading, createPlaylist, removePlaylist, refetch: fetchPlaylists };
}