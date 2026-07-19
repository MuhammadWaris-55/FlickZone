import { motion } from "framer-motion";
import { useSubscribe } from "@/hooks/useSubscribe";

export default function SubscribeButton({ channelId, initialSubscribed }) {
  const { isSubscribed, toggleSub } = useSubscribe(channelId, initialSubscribed);

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={toggleSub}
      className={`px-5 py-2 rounded-full font-body font-medium text-sm transition-colors ${
        isSubscribed
          ? "bg-secondary text-secondary-foreground"
          : "bg-accent text-accent-foreground hover:bg-accent/90"
      }`}
    >
      {isSubscribed ? "Subscribed" : "Subscribe"}
    </motion.button>
  );
}