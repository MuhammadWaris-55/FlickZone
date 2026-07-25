import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SettingsTabs from "@/components/SettingsTabs";
import ProfileSettingsForm from "@/components/ProfileSettingsForm";
import SecuritySettingsForm from "@/components/SecuritySettingsForm";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="font-heading text-2xl font-bold mb-6">Settings</h1>

      <div className="bg-card/40 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
        <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "Profile" && <ProfileSettingsForm />}
            {activeTab === "Security" && <SecuritySettingsForm />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
