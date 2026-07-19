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
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!form.title.trim()) errors.title = true;
    if (!videoFile) errors.videoFile = true;
    if (!thumbnail) errors.thumbnail = true;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
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
              <div>
                <div
                  className={
                    fieldErrors.videoFile
                      ? "ring-2 ring-destructive rounded-xl"
                      : ""
                  }
                >
                  <DropZone
                    label="Video file"
                    accept="video/*"
                    onFileSelect={(f) => {
                      setVideoFile(f);
                      setFieldErrors((prev) => ({ ...prev, videoFile: false }));
                    }}
                    previewType="video"
                  />
                </div>
                {fieldErrors.videoFile && (
                  <p className="text-destructive text-xs mt-1.5">Video file is required.</p>
                )}
              </div>

              <div>
                <div
                  className={
                    fieldErrors.thumbnail
                      ? "ring-2 ring-destructive rounded-xl"
                      : ""
                  }
                >
                  <DropZone
                    label="Thumbnail"
                    accept="image/*"
                    onFileSelect={(f) => {
                      setThumbnail(f);
                      setFieldErrors((prev) => ({ ...prev, thumbnail: false }));
                    }}
                    previewType="image"
                  />
                </div>
                {fieldErrors.thumbnail && (
                  <p className="text-destructive text-xs mt-1.5">Thumbnail is required.</p>
                )}
              </div>
            </div>

            <div>
              <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) => {
                  setForm({ ...form, title: e.target.value });
                  setFieldErrors((prev) => ({ ...prev, title: false }));
                }}
                className={`w-full bg-background/60 border rounded-lg px-4 py-3 text-sm outline-none focus:border-accent transition-colors ${
                  fieldErrors.title ? "border-destructive" : "border-border"
                }`}
              />
              {fieldErrors.title && (
                <p className="text-destructive text-xs mt-1.5">Title is required.</p>
              )}
            </div>

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