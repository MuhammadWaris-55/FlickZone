import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await axiosInstance.get("/users/current-user");
      setUser(res.data.data);
    } catch (err) {
      setUser(null); // not logged in, or refresh also failed — handled by interceptor already
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const res = await axiosInstance.post("/users/login", credentials);
    setUser(res.data.data.user);
    return res.data;
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/users/logout");
    } finally {
      setUser(null); // clear local state regardless of API success
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
