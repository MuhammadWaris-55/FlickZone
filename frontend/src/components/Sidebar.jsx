import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Logo from "@/components/Logo";
import { sidebarNavItems } from "@/utils/navConfig";
import { useSidebar } from "@/hooks/useSidebar";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const { isOpen, toggle } = useSidebar();
const { logout, isAuthenticated } = useAuth();
  return (
    <motion.aside
      animate={{ width: isOpen ? 240 : 76 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="h-screen sticky top-0 bg-background border-r border-border flex flex-col shrink-0"
    >
      <Logo collapsed={!isOpen} />

      <nav className="flex-1 flex flex-col gap-1 px-2 mt-2">
        {sidebarNavItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
              }`
            }
          >
            <Icon size={20} className="shrink-0" />
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="whitespace-nowrap text-sm font-body overflow-hidden"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {isAuthenticated && (
  <button
    onClick={logout}
    className="flex items-center gap-3 px-3 py-2.5 mx-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
  >
    <LogOut size={20} className="shrink-0" />
    {isOpen && <span className="text-sm font-body whitespace-nowrap">Logout</span>}
  </button>
)}

      <button
        onClick={toggle}
        className="flex items-center justify-center p-3 mx-2 mb-3 rounded-lg hover:bg-accent/50 transition-colors"
      >
        {isOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
      </button>
    </motion.aside>
  );
}