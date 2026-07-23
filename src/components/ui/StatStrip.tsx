import CountUp from "./CountUp";
import type { Stat } from "@/lib/types";

export default function StatStrip({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-0 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`border-t-2 py-8 pr-8 ${
            i === 0 ? "border-accent" : "border-line"
          }`}
        >
          <p className="font-display text-5xl font-extrabold tracking-tight text-paper sm:text-6xl">
            <CountUp value={stat.value} />
          </p>
          <div className="mt-2 h-px w-6 bg-accent" />
          <p className="mt-3 text-sm leading-snug text-muted">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
