import { NavLink } from "react-router-dom";
import { mobileNavItems } from "@/utils/navConfig";
import { useAuth } from "@/context/AuthContext";

export default function BottomTabBar() {
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border flex items-center justify-around z-50">
      {mobileNavItems.map(({ label, icon: Icon, path, isCenter }) => {
        const resolvedPath =
          label === "Profile" && user ? `/channel/${user.username}` : path;

        return (
          <NavLink
            key={label}
            to={resolvedPath}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 flex-1 h-full ${
                isCenter
                  ? "text-accent"
                  : isActive
                    ? "text-accent"
                    : "text-foreground/60"
              }`
            }
          >
            <Icon size={isCenter ? 26 : 22} />
            {!isCenter && (
              <span className="text-[10px] font-body">{label}</span>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
