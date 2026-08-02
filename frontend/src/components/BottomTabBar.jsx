import { useNavigate, useLocation } from "react-router-dom";
import { mobileNavItems } from "@/utils/navConfig";
import { useAuth } from "@/context/AuthContext";

// Routes that require login
const PROTECTED_LABELS = ["Upload", "Subscriptions", "Library", "Profile"];

export default function BottomTabBar() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (item) => {
    const needsAuth = PROTECTED_LABELS.includes(item.label);

    if (needsAuth && !isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (item.label === "Profile" && user) {
      navigate(`/channel/${user.username}`);
      return;
    }

    navigate(item.path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border flex items-center justify-around z-50">
      {mobileNavItems.map((item) => {
        const { label, icon: Icon, path, isCenter } = item;
        const resolvedPath =
          label === "Profile" && user ? `/channel/${user.username}` : path;
        const isActive = location.pathname === resolvedPath;

        return (
          <button
            key={label}
            onClick={() => handleNav(item)}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full ${
              isCenter
                ? "text-accent"
                : isActive
                  ? "text-accent"
                  : "text-foreground/60"
            }`}
          >
            <Icon size={isCenter ? 26 : 22} />
            {!isCenter && (
              <span className="text-[10px] font-body">{label}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
