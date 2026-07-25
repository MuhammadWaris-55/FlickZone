import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
} from "@/api/userApi";
import DropZone from "@/components/DropZone";

export default function ProfileSettingsForm() {
  const { user, checkAuth } = useAuth();
  const [fullname, setFullname] = useState(user?.fullname || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleAvatarSelect = async (file) => {
    if (!file) return;
    try {
      await updateAvatar(file);
      await checkAuth();
      setSuccess("Avatar updated");
      setTimeout(() => setSuccess(""), 2000);
    } catch {
      setError("Failed to update avatar");
    }
  };

  const handleCoverSelect = async (file) => {
    if (!file) return;
    try {
      await updateCoverImage(file);
      await checkAuth();
      setSuccess("Cover image updated");
      setTimeout(() => setSuccess(""), 2000);
    } catch {
      setError("Failed to update cover image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await updateAccountDetails(fullname, email);
      await checkAuth();
      setSuccess("Profile updated successfully");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-muted-foreground mb-1.5">Cover image</p>
        <DropZone
          label="Change cover image"
          accept="image/*"
          onFileSelect={handleCoverSelect}
          previewType="image"
          aspect="banner"
        />
      </div>

      <div className="flex items-center gap-4">
        <DropZone
          label="Avatar"
          accept="image/*"
          onFileSelect={handleAvatarSelect}
          previewType="image"
          shape="circle"
        />
        <div>
          <p className="text-xs font-medium">Profile photo</p>
          <p className="text-[11px] text-muted-foreground">Click to change</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">
            Full Name
          </label>
          <input
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="w-full bg-background/60 border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-background/60 border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent transition-colors"
          />
        </div>

        {error && <p className="text-destructive text-xs">{error}</p>}
        {success && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-accent text-xs"
          >
            {success}
          </motion.p>
        )}

        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={saving}
          className="bg-accent text-accent-foreground font-medium rounded-lg px-6 py-2.5 text-sm disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </motion.button>
      </form>
    </div>
  );
}
