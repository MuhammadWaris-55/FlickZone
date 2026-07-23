import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function CreatePlaylistModal({ open, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!name.trim()) errors.name = true;
    if (!description.trim()) errors.description = true;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setSubmitting(true);
    try {
      await onCreate(name, description);
      setName("");
      setDescription("");
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setFieldErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-background/70 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-card/90 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-6 z-50 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-bold">New Playlist</h3>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-full hover:bg-white/[0.06] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, name: false }));
                  }}
                  placeholder="Playlist name"
                  autoFocus
                  className={`w-full bg-background/60 border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent transition-colors ${
                    fieldErrors.name ? "border-destructive" : "border-border"
                  }`}
                />
                {fieldErrors.name && (
                  <p className="text-destructive text-xs mt-1">
                    Name is required.
                  </p>
                )}
              </div>

              <div>
                <textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, description: false }));
                  }}
                  placeholder="Description"
                  rows={3}
                  className={`w-full bg-background/60 border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent transition-colors resize-none ${
                    fieldErrors.description
                      ? "border-destructive"
                      : "border-border"
                  }`}
                />
                {fieldErrors.description && (
                  <p className="text-destructive text-xs mt-1">
                    Description is required.
                  </p>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                disabled={submitting}
                className="w-full bg-accent text-accent-foreground font-medium rounded-lg py-2.5 disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create Playlist"}
              </motion.button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
