import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import EmptyState from "@/components/EmptyState";

export default function Subscribers() {
  const { user } = useAuth();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      axiosInstance
        .get(`/subscriptions/u/${user._id}`)
        .then((res) => setSubscribers(res.data.data || []))
        .catch(() => setSubscribers([]))
        .finally(() => setLoading(false));
    }
  }, [user?._id]);

  return (
    <div className="p-6">
      <h1 className="font-heading text-2xl font-bold mb-6">Subscribers</h1>

      {!loading && subscribers.length === 0 && (
        <EmptyState
          icon={Users}
          title="No subscribers yet"
          description="Once people subscribe to your channel, they'll show up here."
        />
      )}

      {subscribers.length > 0 && (
        <div className="space-y-3">
          {subscribers.map((sub) => (
            <div
              key={sub._id}
              className="flex items-center gap-3 bg-card/40 backdrop-blur-xl border border-border rounded-xl p-3"
            >
              <img
                src={sub.subscriber?.avatar}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-sm font-medium">
                {sub.subscriber?.username}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
