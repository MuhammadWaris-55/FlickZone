import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "@/api/axiosInstance";
import AuthCard from "@/components/AuthCard";
import FloatingInput from "@/components/FloatingInput";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", fullName: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axiosInstance.post("/users/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setShake(true);
      setTimeout(() => setShake(false), 400);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard shake={shake}>
      <h2 className="font-heading text-2xl font-bold mb-1">Create account</h2>
      <p className="text-sm text-muted-foreground mb-6">Join FlickZone in seconds</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FloatingInput label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} />
        <FloatingInput label="Username" name="username" value={form.username} onChange={handleChange} />
        <FloatingInput label="Email" name="email" value={form.email} onChange={handleChange} />
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
          {loading ? "Creating account..." : "Sign Up"}
        </motion.button>
      </form>

      <p className="text-sm text-muted-foreground text-center mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-accent font-medium">Log in</Link>
      </p>
    </AuthCard>
  );
}