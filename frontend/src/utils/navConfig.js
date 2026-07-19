import { Home, ThumbsUp, History, Video, FolderOpen, Users, Upload as UploadIcon, User } from "lucide-react";
// Full list for desktop sidebar
export const sidebarNavItems = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Upload", icon: UploadIcon, path: "/upload" },
  { label: "Liked Videos", icon: ThumbsUp, path: "/liked" },
  { label: "History", icon: History, path: "/history" },
  { label: "My Content", icon: Video, path: "/my-content" },
  { label: "Collections", icon: FolderOpen, path: "/collections" },
  { label: "Subscribers", icon: Users, path: "/subscribers" },
];

// Trimmed list for mobile bottom bar (pick 4-5 most important)
export const mobileNavItems = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Subscriptions", icon: Users, path: "/subscriptions" },
  { label: "Upload", icon: UploadIcon, path: "/upload", isCenter: true },
  { label: "Library", icon: FolderOpen, path: "/library" },
  { label: "Profile", icon: User, path: "/profile" },
];