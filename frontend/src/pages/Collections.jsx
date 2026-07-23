import { useState } from "react";
import { motion } from "framer-motion";
import { FolderOpen, Plus } from "lucide-react";
import { usePlaylists } from "@/hooks/usePlaylists";
import PlaylistCard from "@/components/PlaylistCard";
import CreatePlaylistModal from "@/components/CreatePlaylistModal";
import EmptyState from "@/components/EmptyState";

export default function Collections() {
  const { playlists, loading, createPlaylist } = usePlaylists();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold">Collections</h1>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-accent text-accent-foreground text-sm font-medium px-4 py-2 rounded-full"
        >
          <Plus size={16} /> New Playlist
        </motion.button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="aspect-video rounded-xl shimmer" />
          ))}
        </div>
      ) : playlists.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist, i) => (
            <PlaylistCard key={playlist._id} playlist={playlist} index={i} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FolderOpen}
          title="No collections yet"
          description="Create a playlist to organize your favorite videos."
          actionLabel="Create your first playlist"
          actionTo="#"
        />
      )}

      <CreatePlaylistModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={createPlaylist}
      />
    </div>
  );
}
