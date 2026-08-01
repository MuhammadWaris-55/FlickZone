import {
  Home, ThumbsUp, History, Video, FolderOpen, Users,
  Upload as UploadIcon, User, LayoutDashboard, Settings, Compass,
} from "lucide-react";

export const sidebarSections = [
  {
    label: null, // no header for the primary section
    items: [
      { label: "Home", icon: Home, path: "/" },
      { label: "Subscriptions", icon: Compass, path: "/subscriptions" },
      { label: "Upload", icon: UploadIcon, path: "/upload" },
    ],
  },
  {
    label: "You",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
      { label: "Liked Videos", icon: ThumbsUp, path: "/liked" },
      { label: "History", icon: History, path: "/history" },
      { label: "My Content", icon: Video, path: "/my-content" },
      { label: "Collections", icon: FolderOpen, path: "/collections" },
    ],
  },
  {
    label: "General",
    items: [
      { label: "Subscribers", icon: Users, path: "/subscribers" },
      { label: "Settings", icon: Settings, path: "/settings" },
    ],
  },
];

// Kept flat for BottomTabBar, which still just needs 5 items
export const mobileNavItems = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Subscriptions", icon: Users, path: "/subscriptions" },
  { label: "Upload", icon: UploadIcon, path: "/upload", isCenter: true },
  { label: "Library", icon: FolderOpen, path: "/collections" },
  { label: "Profile", icon: User, path: "/profile" },
];