import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { publishVideo } from "@/api/videoApi";

export function useVideoUpload() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = async ({ title, description, videoFile, thumbnail }) => {
    setUploading(true);
    setError("");
    setProgress(0);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnail);

    try {
      const video = await publishVideo(formData, setProgress);
      navigate(`/watch/${video._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return { upload, progress, uploading, error };
}