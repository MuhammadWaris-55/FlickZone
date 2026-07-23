import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ListVideo, Plus } from "lucide-react";
import { getPlaylistById } from "@/api/playlistApi";
import VideoCard from "@/components/VideoCard";
import VideoCardSkeleton from "@/components/VideoCardSkeleton";
import VideoPickerModal from "@/components/VideoPickerModal";

export default function PlaylistDetail() {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);

  const fetchPlaylist = () => {
    getPlaylistById(playlistId)
      .then(setPlaylist)
      .catch(() => setPlaylist(null))
      .finally(() => setLoading(false));
  };

  useEffect(fetchPlaylist, [playlistId]);

  const handleVideoAdded = (video) => {
    setPlaylist((prev) => ({
      ...prev,
      videos: [...(prev.videos || []), video],
    }));
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="h-8 w-1/3 rounded shimmer mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!playlist)
    return <p className="p-6 text-muted-foreground">Playlist not found.</p>;

  const videos = playlist.videos || [];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-heading text-2xl font-bold">{playlist.name}</h1>
          {playlist.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {playlist.description}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {videos.length} videos
          </p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setPickerOpen(true)}
          className="flex items-center gap-2 bg-accent text-accent-foreground text-sm font-medium px-4 py-2 rounded-full shrink-0"
        >
          <Plus size={16} /> Add Video
        </motion.button>
      </div>

      {videos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center text-center py-20"
        >
          <motion.div
            animate={{ rotateY: [0, 15, -15, 0], y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ perspective: 600 }}
            className="relative mb-6"
          >
            <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full scale-125" />
            <div className="relative w-24 h-24 rounded-2xl bg-card/60 backdrop-blur-xl border border-white/[0.08] flex items-center justify-center">
              <ListVideo size={36} className="text-accent" strokeWidth={1.5} />
            </div>
          </motion.div>
          <h3 className="font-heading text-lg font-bold mb-1.5">
            This playlist is empty
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-6">
            Add your first video to start building this collection.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setPickerOpen(true)}
            className="bg-accent text-accent-foreground text-sm font-medium px-5 py-2.5 rounded-full"
          >
            Add a video
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {videos.map((video, i) => (
            <VideoCard key={video._id} video={video} index={i} />
          ))}
        </div>
      )}

      <VideoPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        playlistId={playlistId}
        existingVideoIds={videos.map((v) => v._id)}
        onVideoAdded={handleVideoAdded}
      />
    </div>
  );
}
