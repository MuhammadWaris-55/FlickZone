import { useState } from "react";
import { motion } from "framer-motion";
import DropZone from "@/components/DropZone";
import UploadProgressRing from "@/components/UploadProgressRing";
import { useVideoUpload } from "@/hooks/useVideoUpload";

export default function Upload() {
  const { upload, progress, uploading, error } = useVideoUpload();
  const [form, setForm] = useState({ title: "", description: "" });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!videoFile || !thumbnail || !form.title) return;
    upload({ ...form, videoFile, thumbnail });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card/40 backdrop-blur-xl border border-border rounded-2xl p-6 md:p-8"
      >
        <h1 className="font-heading text-2xl font-bold mb-6">Upload a video</h1>

        {uploading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <UploadProgressRing progress={progress} />
            <p className="text-sm text-muted-foreground">
              Uploading your video...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <DropZone
                label="Video file"
                accept="video/*"
                onFileSelect={setVideoFile}
                previewType="video"
              />
              <DropZone
                label="Thumbnail"
                accept="image/*"
                onFileSelect={setThumbnail}
                previewType="image"
              />
            </div>

            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-background/60 border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={4}
              className="w-full bg-background/60 border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-accent transition-colors resize-none"
            />

            {error && <p className="text-destructive text-xs">{error}</p>}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-accent text-accent-foreground font-medium rounded-lg py-3"
            >
              Publish Video
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
