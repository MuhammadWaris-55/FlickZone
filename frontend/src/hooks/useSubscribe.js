import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toggleSubscription } from "@/api/subscriptionApi";

export function useSubscribe(channelId, initialSubscribed = false, initialCount = 0) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubscribed, setIsSubscribed] = useState(initialSubscribed);
  const [subscriberCount, setSubscriberCount] = useState(initialCount);

  const toggleSub = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    setIsSubscribed((prev) => !prev);
    setSubscriberCount((prev) => (isSubscribed ? prev - 1 : prev + 1));

    try {
      await toggleSubscription(channelId);
    } catch (err) {
      setIsSubscribed((prev) => !prev);
      setSubscriberCount((prev) => (isSubscribed ? prev + 1 : prev - 1));
    }
  };

  return { isSubscribed, subscriberCount, toggleSub };
}