import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ChannelAvatarRow({ channels }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 mb-8 scrollbar-hide">
      {channels.map((channel, i) => (
        <motion.div
          key={channel._id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: i * 0.04 }}
        >
          <Link
            to={`/channel/${channel.username}`}
            className="flex flex-col items-center gap-1.5 shrink-0 group"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-accent/0 group-hover:bg-accent/20 blur-md transition-colors duration-300" />
              <img
                src={channel.avatar}
                alt={channel.username}
                className="relative w-14 h-14 rounded-full object-cover ring-2 ring-transparent group-hover:ring-accent/50 transition-all duration-300"
              />
            </div>
            <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors max-w-[60px] truncate">
              {channel.username}
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
