import Sidebar from "@/components/Sidebar";
import BottomTabBar from "@/components/BottomTabBar";
import { useBreakpoint } from "@/hooks/useBreakpoint";

export default function Navigation() {
  const isMobile = useBreakpoint();
  return isMobile ? <BottomTabBar /> : <Sidebar />;
}