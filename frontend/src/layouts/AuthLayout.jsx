import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Logo from "@/components/Logo";

export default function AuthLayout() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const blobX = useTransform(mouseX, [0, 1], [-30, 30]);
  const blobY = useTransform(mouseY, [0, 1], [-30, 30]);

  useEffect(() => {
    const handleMove = (e) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  return (
    <div className="min-h-screen flex bg-background overflow-hidden">
      {/* Visual panel — hidden on mobile */}
      <div className="hidden lg:flex relative w-1/2 items-center justify-center overflow-hidden">
        <motion.div
          style={{ x: blobX, y: blobY }}
          className="absolute w-[420px] h-[420px] rounded-full bg-accent/40 blur-[100px]"
        />
        <motion.div
          style={{ x: useTransform(blobX, (v) => -v), y: useTransform(blobY, (v) => -v) }}
          className="absolute w-[320px] h-[320px] rounded-full bg-accent-mid/50 blur-[90px] top-1/3 right-10"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute w-[280px] h-[280px] border border-accent/20 rounded-full"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center px-10"
        >
          <h1 className="font-heading text-4xl font-bold mb-3">Welcome to FlickZone</h1>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Watch, share, and create — join a community built for creators and viewers alike.
          </p>
        </motion.div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative">
        <div className="lg:hidden mb-6">
          <Logo />
        </div>
        <Outlet />
      </div>
    </div>
  );
}