import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import AuthCard from "@/components/AuthCard";
import FloatingInput from "@/components/FloatingInput";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
      setShake(true);
      setTimeout(() => setShake(false), 400);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard shake={shake}>
      <h2 className="font-heading text-2xl font-bold mb-1">Welcome back</h2>
      <p className="text-sm text-muted-foreground mb-6">Log in to continue watching</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FloatingInput label="Email or Username" name="email" value={form.email} onChange={handleChange} />
        <FloatingInput label="Password" type="password" name="password" value={form.password} onChange={handleChange} />

        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-destructive text-xs">
            {error}
          </motion.p>
        )}

        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          className="w-full bg-accent text-accent-foreground font-medium rounded-lg py-2.5 mt-2 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log In"}
        </motion.button>
      </form>

      <p className="text-sm text-muted-foreground text-center mt-6">
        Don't have an account?{" "}
        <Link to="/register" className="text-accent font-medium">Sign up</Link>
      </p>
    </AuthCard>
  );
}