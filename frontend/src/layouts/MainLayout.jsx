import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import Navigation from "@/components/Navigation";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-background relative">
      {/* Ambient background layer — contains its own overflow, doesn't affect layout */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 60, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[5%] w-[450px] h-[450px] rounded-full bg-accent-mid/10 blur-[130px]"
        />
      </div>

      <Navigation />
      <main className="flex-1 pb-16 md:pb-0 relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
