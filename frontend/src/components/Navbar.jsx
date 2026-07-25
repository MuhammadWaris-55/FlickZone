import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  User,
  LayoutDashboard,
  LogOut,
  Upload,
} from "lucide-react";
import { Settings as SettingsIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { searchVideos } from "@/api/videoApi";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (search.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const timeout = setTimeout(() => {
      searchVideos(search)
        .then((data) => {
          setSuggestions((data.docs || data || []).slice(0, 5));
        })
        .catch(() => setSuggestions([]));
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
      setShowSuggestions(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center gap-4 px-4 md:px-6 bg-background/50 backdrop-blur-2xl border-b border-white/[0.06]">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-xl relative group">
        <Search
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder="Search FlickZone..."
          className="w-full bg-card/40 border border-border rounded-full pl-10 pr-4 py-2 text-sm outline-none
                     focus:border-accent focus:bg-card/70 transition-all duration-200"
        />

        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 w-full bg-card/90 backdrop-blur-2xl border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-50"
            >
              {suggestions.map((video) => (
                <button
                  key={video._id}
                  type="button"
                  onClick={() => {
                    navigate(`/watch/${video._id}`);
                    setShowSuggestions(false);
                    setSearch("");
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-white/[0.05] transition-colors"
                >
                  <img
                    src={video.thumbnail}
                    alt=""
                    className="w-14 h-9 rounded object-cover shrink-0"
                  />
                  <span className="text-xs truncate">{video.title}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <div className="flex-1" />

      {/* Notifications */}
      <motion.button
        whileHover={{ scale: 1.08, rotate: [0, -8, 8, 0] }}
        whileTap={{ scale: 0.92 }}
        transition={{ duration: 0.3 }}
        className="relative p-2.5 rounded-full hover:bg-white/[0.06] transition-colors"
      >
        <Bell size={19} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full ring-2 ring-background" />
      </motion.button>

      {/* Profile / Auth */}
      {isAuthenticated ? (
        <div className="relative" ref={dropdownRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-full ring-2 ring-transparent hover:ring-accent/40 transition-all"
          >
            <img
              src={user?.avatar}
              alt={user?.username}
              className="w-9 h-9 rounded-full object-cover"
            />
          </motion.button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                style={{ transformOrigin: "top right" }}
                className="absolute right-0 mt-3 w-56 bg-card/70 backdrop-blur-2xl border border-white/[0.08]
                           rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)] overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <p className="text-sm font-medium">{user?.fullname}</p>
                  <p className="text-xs text-muted-foreground">
                    @{user?.username}
                  </p>
                </div>

                <Link
                  to={`/channel/${user?.username}`}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm
                   hover:bg-white/[0.05] transition-colors"
                >
                  <User size={16} /> Your Channel
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/[0.05] transition-colors"
                >
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                <Link
                  to="/upload"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/[0.05] transition-colors"
                >
                  <Upload size={16} /> Upload Video
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/[0.05] transition-colors"
                >
                  <SettingsIcon size={16} /> Settings
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut size={16} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="text-sm font-medium px-4 py-2 rounded-full hover:bg-white/[0.06] transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="text-sm font-medium px-4 py-2 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
          >
            Sign up
          </Link>
        </div>
      )}
    </header>
  );
}
