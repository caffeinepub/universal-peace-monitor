import { Globe, TrendingDown, TrendingUp, Users } from "lucide-react";
import { motion } from "motion/react";
import type { Individual } from "../backend";
import {
  useGetAllIndividualsRanked,
  useGetIndividualStats,
} from "../hooks/useQueries";

function StatBox({
  label,
  value,
  icon: Icon,
  glow,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  glow?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 py-3 px-4 rounded-lg bg-white/[0.03] border border-white/5">
      <div className="flex items-center gap-2">
        <Icon
          className={`w-3.5 h-3.5 ${glow ? "text-aurora-teal" : "text-muted-foreground"}`}
        />
        <span className="text-[9px] font-display tracking-[0.25em] text-muted-foreground uppercase">
          {label}
        </span>
      </div>
      <span
        className={`font-display font-800 text-xl tracking-tight ${
          glow ? "score-glow-sm" : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default function GlobalStats() {
  const { data: ranked = [] } = useGetAllIndividualsRanked();
  const { data: stats } = useGetIndividualStats();

  const totalBeings = stats ? Number(stats[0]) : ranked.length;
  const universeAvg = stats ? stats[1].toFixed(1) : "—";

  const topScorer = ranked[0] as Individual | undefined;
  const bottomScorer = ranked[ranked.length - 1] as Individual | undefined;

  return (
    <motion.div
      id="stats"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="glass-card rounded-xl shadow-card p-5 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-aurora-teal" />
        <h2 className="font-display font-700 text-[11px] tracking-[0.25em] text-foreground uppercase">
          Universe Status
        </h2>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="live-dot w-1.5 h-1.5 rounded-full bg-aurora-teal block" />
          <span className="text-[9px] tracking-widest text-aurora-teal uppercase">
            Live
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <StatBox
          label="Total Beings Tracked"
          value={totalBeings.toLocaleString()}
          icon={Users}
        />
        <StatBox
          label="Universe Avg Score"
          value={universeAvg}
          icon={Globe}
          glow
        />
        {topScorer && (
          <StatBox
            label="Most Peaceful"
            value={`${topScorer.name} · ${Number(topScorer.peaceScore)}`}
            icon={TrendingUp}
            glow
          />
        )}
        {bottomScorer && bottomScorer.name !== topScorer?.name && (
          <StatBox
            label="Least Peaceful"
            value={`${bottomScorer.name} · ${Number(bottomScorer.peaceScore)}`}
            icon={TrendingDown}
          />
        )}
      </div>

      {/* Universe peace bar */}
      {stats && (
        <div className="mt-1">
          <div className="flex justify-between mb-1.5">
            <span className="text-[9px] tracking-widest text-muted-foreground uppercase">
              Peace Level
            </span>
            <span className="text-[9px] text-aurora-teal font-mono">
              {stats[1].toFixed(1)} / 1000
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-aurora-teal to-aurora-cyan"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (stats[1] / 1000) * 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
