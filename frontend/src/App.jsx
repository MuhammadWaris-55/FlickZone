import React from "react";
import "./index.css";
import { Button } from "@/components/ui/button";
import AppRoutes from "@/routes/AppRoutes";
import { useAuth } from "@/context/AuthContext";
import AppLoadingScreen from "@/components/AppLoadingScreen";

const App = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <AppLoadingScreen />;

  return (
   <AppRoutes />
  

  );
};

export default App;
