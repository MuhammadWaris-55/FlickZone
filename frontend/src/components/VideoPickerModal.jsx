import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getVideosByOwner } from "@/api/videoApi";
import { addVideoToPlaylist } from "@/api/playlistApi";

export default function VideoPickerModal({
  open,
  onClose,
  playlistId,
  existingVideoIds = [],
  onVideoAdded,
}) {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    if (open && user?._id) {
      setLoading(true);
      getVideosByOwner(user._id)
        .then((data) => setVideos(data.docs || data || []))
        .catch(() => setVideos([]))
        .finally(() => setLoading(false));
    }
  }, [open, user?._id]);

  const handleAdd = async (video) => {
    setBusyId(video._id);
    try {
      await addVideoToPlaylist(playlistId, video._id);
      onVideoAdded(video);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/70 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-card/90 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-5 z-50 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-bold">Add a video</h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/[0.06] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2">
              {loading ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  Loading your videos...
                </p>
              ) : videos.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  You haven't uploaded any videos yet.
                </p>
              ) : (
                videos.map((video) => {
                  const alreadyAdded = existingVideoIds.includes(video._id);
                  return (
                    <button
                      key={video._id}
                      onClick={() => !alreadyAdded && handleAdd(video)}
                      disabled={alreadyAdded || busyId === video._id}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.05] transition-colors disabled:opacity-50 text-left"
                    >
                      <img
                        src={video.thumbnail}
                        alt=""
                        className="w-20 aspect-video rounded object-cover shrink-0"
                      />
                      <span className="text-sm truncate flex-1">
                        {video.title}
                      </span>
                      {alreadyAdded && (
                        <Check size={16} className="text-accent shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
