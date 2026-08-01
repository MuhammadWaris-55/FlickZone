import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Logo from "@/components/Logo";
import { sidebarSections } from "@/utils/navConfig";
import { useSidebar } from "@/hooks/useSidebar";

export default function Sidebar() {
  const { isOpen, toggle } = useSidebar();

  return (
    <>
      <motion.div
        animate={{ width: isOpen ? 240 : 76 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="shrink-0 hidden md:block"
      />

      <motion.aside
        animate={{ width: isOpen ? 240 : 76 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="hidden md:flex fixed top-0 left-0 h-screen z-40 flex-col
                   bg-background/60 backdrop-blur-2xl border-r border-white/[0.06]
                   shadow-[8px_0_30px_-15px_rgba(0,0,0,0.5)]"
      >
        <Logo collapsed={!isOpen} />

        <nav className="flex-1 flex flex-col gap-1 px-2 mt-2 overflow-y-auto scrollbar-hide">
          {sidebarSections.map((section, sIdx) => (
            <div
              key={sIdx}
              className={
                sIdx > 0 ? "mt-3 pt-3 border-t border-white/[0.06]" : ""
              }
            >
              <AnimatePresence>
                {isOpen && section.label && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-3 mb-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    {section.label}
                  </motion.p>
                )}
              </AnimatePresence>

              {section.items.map(({ label, icon: Icon, path }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors overflow-hidden ${
                      isActive
                        ? "bg-accent/15 text-accent"
                        : "hover:bg-white/[0.04] text-foreground/80"
                    }`
                  }
                >
                  <Icon size={19} className="shrink-0" />
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
            </div>
          ))}
        </nav>

        <button
          onClick={toggle}
          className="flex items-center justify-center p-3 mx-2 mb-3 rounded-lg hover:bg-white/[0.04] transition-colors"
        >
          {isOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>
      </motion.aside>
    </>
  );
}
