import React from "react";
import "./index.css";
import { Button } from "@/components/ui/button";
import AppRoutes from "@/routes/AppRoutes";
import { useAuth } from "@/context/AuthContext";

const App = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <p>Checking auth...</p>;

  return (
   <AppRoutes />

  );
};

export default App;
