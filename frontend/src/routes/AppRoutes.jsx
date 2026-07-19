import { Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";

import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Watch from "@/pages/Watch";
import Dashboard from "@/pages/Dashboard";
import AuthLayout from "@/layouts/AuthLayout";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Every route nested inside here renders through MainLayout's <Outlet /> */}
      <Route element={<MainLayout />}>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/watch/:videoId" element={<Watch />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Login/Register render WITHOUT the sidebar/nav — standalone pages */}
      <Route element={<AuthLayout />}>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
</Route>
    </Routes>
  );
}