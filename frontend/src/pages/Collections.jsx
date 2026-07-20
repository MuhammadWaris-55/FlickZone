import { FolderOpen } from "lucide-react";
import EmptyState from "@/components/EmptyState";

export default function Collections() {
  return (
    <div className="p-6">
      <h1 className="font-heading text-2xl font-bold mb-6">Collections</h1>
      <EmptyState
        icon={FolderOpen}
        title="No collections yet"
        description="Organize your favorite videos into playlists to find them faster later."
        actionLabel="Explore videos"
        actionTo="/"
      />
    </div>
  );
}
