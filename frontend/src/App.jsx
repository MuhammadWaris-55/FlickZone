import React from "react";
import "./index.css";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const App = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <p>Checking auth...</p>;

  return (
    <div>
      <div>
        <p>
          {isAuthenticated ? `Logged in as ${user?.username}` : "Not logged in"}
        </p>
      </div>
      <h1 className="font-heading text-4xl font-bold">FlickZone</h1>
      <Button>Test Button</Button>
    </div>
  );
};

export default App;
