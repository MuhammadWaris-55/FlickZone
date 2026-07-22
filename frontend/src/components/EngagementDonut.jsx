import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = [
  "var(--color-accent)",
  "var(--color-accent-mid)",
  "var(--color-accent-deep)",
];

export default function EngagementDonut({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-card/40 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 md:p-6 flex flex-col"
    >
      <h3 className="font-heading font-semibold text-sm mb-4">
        Engagement Breakdown
      </h3>
      <div className="relative h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={78}
              paddingAngle={3}
              animationDuration={1000}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "var(--color-card)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-heading text-xl font-bold">
            {total.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground">Total</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            <span className="text-muted-foreground">{d.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
