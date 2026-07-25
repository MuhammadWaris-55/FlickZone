import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Captions,
  Check,
} from "lucide-react";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export default function CustomVideoPlayer({ src }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hideTimerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [showBigIcon, setShowBigIcon] = useState(false);
  const [bigIcon, setBigIcon] = useState("play");
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  const formatTime = (t) => {
    if (!t || isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const triggerBigIcon = (type) => {
    setBigIcon(type);
    setShowBigIcon(true);
    setTimeout(() => setShowBigIcon(false), 500);
  };

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      triggerBigIcon("play");
    } else {
      video.pause();
      triggerBigIcon("pause");
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100 || 0);
    };
    const onLoadedMeta = () => setDuration(video.duration);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMeta);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMeta);
    };
  }, []);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const resetHideTimer = useCallback(() => {
    setControlsVisible(true);
    clearTimeout(hideTimerRef.current);
    if (isPlaying) {
      hideTimerRef.current = setTimeout(() => setControlsVisible(false), 2500);
    }
  }, [isPlaying]);

  useEffect(() => {
    resetHideTimer();
    return () => clearTimeout(hideTimerRef.current);
  }, [isPlaying, resetHideTimer]);

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pct * duration;
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    videoRef.current.volume = val;
    setVolume(val);
    setMuted(val === 0);
    videoRef.current.muted = val === 0;
  };

  const toggleMute = () => {
    const video = videoRef.current;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const changeSpeed = (s) => {
    videoRef.current.playbackRate = s;
    setSpeed(s);
    setShowSpeedMenu(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => isPlaying && setControlsVisible(false)}
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden group select-none"
    >
      <video
        ref={videoRef}
        src={src}
        onClick={togglePlay}
        className="w-full h-full cursor-pointer"
      />

      {/* Center burst play/pause animation */}
      <AnimatePresence>
        {showBigIcon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1.15 }}
            exit={{ opacity: 0, scale: 1.4 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-background/60 backdrop-blur-md rounded-full p-5">
              {bigIcon === "play" ? (
                <Play size={32} fill="white" className="text-white ml-1" />
              ) : (
                <Pause size={32} fill="white" className="text-white" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent center play button when paused */}
      <AnimatePresence>
        {!isPlaying && !showBigIcon && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-16 h-16 flex items-center justify-center bg-accent/90 backdrop-blur-md rounded-full shadow-lg"
          >
            <Play
              size={26}
              fill="currentColor"
              className="text-accent-foreground ml-1"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Bottom control bar */}
      <AnimatePresence>
        {controlsVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 pb-2 pt-8"
          >
            {/* Progress bar */}
            <div
              onClick={handleSeek}
              className="relative h-1.5 bg-white/20 rounded-full cursor-pointer mb-3 group/bar"
            >
              <div
                className="absolute top-0 left-0 h-full bg-accent rounded-full"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-accent rounded-full opacity-0 group-hover/bar:opacity-100 transition-opacity"
                style={{ left: `calc(${progress}% - 6px)` }}
              />
            </div>

            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="hover:text-accent transition-colors"
                >
                  {isPlaying ? (
                    <Pause size={18} fill="currentColor" />
                  ) : (
                    <Play size={18} fill="currentColor" />
                  )}
                </button>

                <div className="flex items-center gap-1.5 group/vol">
                  <button
                    onClick={toggleMute}
                    className="hover:text-accent transition-colors"
                  >
                    {muted || volume === 0 ? (
                      <VolumeX size={18} />
                    ) : (
                      <Volume2 size={18} />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={muted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-0 group-hover/vol:w-16 transition-all duration-200 accent-[var(--color-accent)] h-1"
                  />
                </div>

                <span className="text-xs font-body tabular-nums">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Captions toggle */}
                <button
                  onClick={() => setCaptionsOn((p) => !p)}
                  title="Captions"
                  className={`hover:text-accent transition-colors ${captionsOn ? "text-accent" : ""}`}
                >
                  <Captions size={18} />
                </button>

                {/* Speed menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowSpeedMenu((p) => !p)}
                    className="flex items-center gap-1 hover:text-accent transition-colors text-xs font-medium"
                  >
                    <Settings size={17} />
                    {speed}x
                  </button>
                  <AnimatePresence>
                    {showSpeedMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.95 }}
                        transition={{ duration: 0.12 }}
                        className="absolute bottom-8 right-0 bg-background/95 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden w-24 shadow-2xl"
                      >
                        {SPEEDS.map((s) => (
                          <button
                            key={s}
                            onClick={() => changeSpeed(s)}
                            className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-white/10 transition-colors"
                          >
                            {s}x{" "}
                            {s === speed && (
                              <Check size={12} className="text-accent" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={toggleFullscreen}
                  className="hover:text-accent transition-colors"
                >
                  {isFullscreen ? (
                    <Minimize size={18} />
                  ) : (
                    <Maximize size={18} />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
