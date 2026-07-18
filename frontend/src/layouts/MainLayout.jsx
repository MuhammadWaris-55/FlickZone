import Navigation from "@/components/Navigation";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
}