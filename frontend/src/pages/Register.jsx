import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "@/api/axiosInstance";
import AuthCard from "@/components/AuthCard";
import FloatingInput from "@/components/FloatingInput";
import DropZone from "@/components/DropZone";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!form.fullname.trim()) errors.fullname = true;
    if (!form.username.trim()) errors.username = true;
    if (!form.email.trim()) errors.email = true;
    if (!form.password.trim()) errors.password = true;
    if (!avatar) errors.avatar = true; // required by backend

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("fullname", form.fullname);
    formData.append("username", form.username);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("avatar", avatar);
    if (coverImage) formData.append("coverImage", coverImage);

    try {
      await axiosInstance.post("/users/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
    <AuthCard shake={shake} wide>
      <h2 className="font-heading text-2xl font-bold mb-1">Create account</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Join FlickZone in seconds
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Cover image — wide banner drop zone */}
        <div>
          <p className="text-xs text-muted-foreground mb-1.5">
            Cover image (optional)
          </p>
          <DropZone
            label="Add a cover image"
            accept="image/*"
            onFileSelect={setCoverImage}
            previewType="image"
            aspect="banner"
          />
        </div>

        {/* Avatar — small circular drop zone, overlapping cover like a real profile setup */}
        <div className="flex items-center gap-4 -mt-10 relative z-10 pl-2">
          <div
            className={
              fieldErrors.avatar ? "ring-2 ring-destructive rounded-full" : ""
            }
          >
            <DropZone
              label="Avatar"
              accept="image/*"
              onFileSelect={(f) => {
                setAvatar(f);
                setFieldErrors((prev) => ({ ...prev, avatar: false }));
              }}
              previewType="image"
              shape="circle"
            />
          </div>
          <div>
            <p className="text-xs font-medium">Profile photo</p>
            <p className="text-[11px] text-muted-foreground">Required</p>
            {fieldErrors.avatar && (
              <p className="text-destructive text-[11px] mt-0.5">
                Avatar is required
              </p>
            )}
          </div>
        </div>

        <div>
          <FloatingInput
            label="Full Name"
            name="fullname"
            value={form.fullname}
            onChange={handleChange}
          />
          {fieldErrors.fullname && (
            <p className="text-destructive text-xs mt-1">
              Full name is required
            </p>
          )}
        </div>

        <div>
          <FloatingInput
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
          />
          {fieldErrors.username && (
            <p className="text-destructive text-xs mt-1">
              Username is required
            </p>
          )}
        </div>

        <div>
          <FloatingInput
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          {fieldErrors.email && (
            <p className="text-destructive text-xs mt-1">Email is required</p>
          )}
        </div>

        <div>
          <FloatingInput
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
          {fieldErrors.password && (
            <p className="text-destructive text-xs mt-1">
              Password is required
            </p>
          )}
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-destructive text-xs"
          >
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
        <Link to="/login" className="text-accent font-medium">
          Log in
        </Link>
      </p>
    </AuthCard>
  );
}
