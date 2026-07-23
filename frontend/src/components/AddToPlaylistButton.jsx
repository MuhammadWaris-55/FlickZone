import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ListPlus, Check, Plus } from "lucide-react";
import { usePlaylists } from "@/hooks/usePlaylists";
import { addVideoToPlaylist, removeVideoFromPlaylist } from "@/api/playlistApi";
import CreatePlaylistModal from "@/components/CreatePlaylistModal";

export default function AddToPlaylistButton({ videoId }) {
  const { playlists, createPlaylist, refetch } = usePlaylists();
  const [open, setOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isInPlaylist = (playlist) =>
    playlist.videos?.some((v) => (v._id || v) === videoId);

  const handleToggle = async (playlist) => {
    setBusyId(playlist._id);
    try {
      if (isInPlaylist(playlist)) {
        await removeVideoFromPlaylist(playlist._id, videoId);
      } else {
        await addVideoToPlaylist(playlist._id, videoId);
      }
      refetch();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-white/[0.05] transition-colors"
      >
        <ListPlus size={18} />
        <span className="text-sm font-body">Save</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 mt-2 w-64 bg-card/90 backdrop-blur-2xl border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <p className="text-sm font-medium">Save to playlist</p>
            </div>

            <div className="max-h-56 overflow-y-auto">
              {playlists.length === 0 ? (
                <p className="px-4 py-3 text-xs text-muted-foreground">
                  No playlists yet.
                </p>
              ) : (
                playlists.map((playlist) => (
                  <button
                    key={playlist._id}
                    onClick={() => handleToggle(playlist)}
                    disabled={busyId === playlist._id}
                    className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm hover:bg-white/[0.05] transition-colors disabled:opacity-50"
                  >
                    <span className="truncate">{playlist.name}</span>
                    {isInPlaylist(playlist) && (
                      <Check size={16} className="text-accent shrink-0" />
                    )}
                  </button>
                ))
              )}
            </div>

            <button
              onClick={() => {
                setCreateModalOpen(true);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-accent hover:bg-accent/10 transition-colors border-t border-white/[0.06]"
            >
              <Plus size={16} /> Create new playlist
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <CreatePlaylistModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={createPlaylist}
      />
    </div>
  );
}
