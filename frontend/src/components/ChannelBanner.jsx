import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SubscribeButton from "@/components/SubscribeButton";

export default function ChannelBanner({ channel }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bannerY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const avatarY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);

  return (
    <div ref={ref}>
      <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden">
        <motion.div
          style={{ y: bannerY }}
          className="absolute inset-0 scale-110"
        >
          <img
            src={channel.coverImage || "/default-cover.jpg"}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </motion.div>
      </div>

      <div className="relative -mt-14 md:-mt-16 px-6 flex flex-col md:flex-row md:items-end gap-4">
        <motion.div style={{ y: avatarY }} className="relative z-10">
          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            whileHover={{ scale: 1.04 }}
            src={channel.avatar}
            alt={channel.username}
            className="w-28 h-28 rounded-full object-cover border-4 border-background shadow-[0_0_30px_-5px_var(--color-accent)]"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-1"
        >
          <div>
            <h1 className="font-heading text-xl md:text-2xl font-bold">
              {channel.fullName}
            </h1>
            <p className="text-sm text-muted-foreground">@{channel.username}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {channel.subscribersCount ?? 0} Subscribers ·{" "}
              {channel.channelsSubscribedToCount ?? 0} Subscribed
            </p>
          </div>

          <SubscribeButton
            channelId={channel._id}
            initialSubscribed={channel.isSubscribed}
          />
        </motion.div>
      </div>
    </div>
  );
}
