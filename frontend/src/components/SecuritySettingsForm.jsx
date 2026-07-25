import { useState } from "react";
import { motion } from "framer-motion";
import { changePassword } from "@/api/userApi";
import FloatingInput from "@/components/FloatingInput";

export default function SecuritySettingsForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    setSaving(true);
    try {
      await changePassword(oldPassword, newPassword);
      setSuccess("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <FloatingInput
        label="Current Password"
        type="password"
        name="oldPassword"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <FloatingInput
        label="New Password"
        type="password"
        name="newPassword"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <FloatingInput
        label="Confirm New Password"
        type="password"
        name="confirmPassword"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

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
        {saving ? "Updating..." : "Update Password"}
      </motion.button>
    </form>
  );
}
