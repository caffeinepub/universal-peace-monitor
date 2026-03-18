import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  RefreshCw,
  Search,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Individual } from "../backend";
import {
  useApplyDynamicDrift,
  useDeleteIndividual,
  useGetAllIndividualsRanked,
} from "../hooks/useQueries";

function getRankClass(rank: number) {
  if (rank === 1) return "rank-1";
  if (rank === 2) return "rank-2";
  if (rank === 3) return "rank-3";
  return "text-muted-foreground";
}

function ScoreDelta({ delta }: { delta: number }) {
  if (delta === 0)
    return <span className="text-muted-foreground text-xs">—</span>;
  if (delta > 0)
    return (
      <span className="flex items-center gap-0.5 text-success text-xs font-600">
        <TrendingUp className="w-3 h-3" />+{delta}
      </span>
    );
  return (
    <span className="flex items-center gap-0.5 text-destructive text-xs font-600">
      <TrendingDown className="w-3 h-3" />
      {delta}
    </span>
  );
}

export default function Leaderboard() {
  const { data: individuals = [], isLoading } = useGetAllIndividualsRanked();
  const driftMutation = useApplyDynamicDrift();
  const deleteMutation = useDeleteIndividual();
  const [search, setSearch] = useState("");
  const prevScoresRef = useRef<Map<string, number>>(new Map());
  const [deltas, setDeltas] = useState<Map<string, number>>(new Map());
  const [flashMap, setFlashMap] = useState<Map<string, "up" | "down">>(
    new Map(),
  );

  useEffect(() => {
    if (!individuals.length) return;
    const newDeltas = new Map<string, number>();
    const newFlash = new Map<string, "up" | "down">();
    const prev = prevScoresRef.current;

    for (const ind of individuals) {
      const prevScore = prev.get(ind.name);
      const currScore = Number(ind.peaceScore);
      if (prevScore !== undefined) {
        const d = currScore - prevScore;
        newDeltas.set(ind.name, d);
        if (d > 0) newFlash.set(ind.name, "up");
        else if (d < 0) newFlash.set(ind.name, "down");
      } else {
        newDeltas.set(ind.name, 0);
      }
      prev.set(ind.name, currScore);
    }

    setDeltas(newDeltas);
    setFlashMap(newFlash);

    const timer = setTimeout(() => setFlashMap(new Map()), 1200);
    return () => clearTimeout(timer);
  }, [individuals]);

  const filtered = individuals.filter((i: Individual) =>
    i.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDrift = async () => {
    try {
      await driftMutation.mutateAsync();
      toast.success("Peace scores updated across the universe");
    } catch {
      toast.error("Failed to apply drift");
    }
  };

  const handleDelete = async (name: string) => {
    try {
      await deleteMutation.mutateAsync(name);
      toast.success(`${name} removed from the universe`);
    } catch {
      toast.error("Failed to delete individual");
    }
  };

  return (
    <motion.div
      id="leaderboard"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-card rounded-xl shadow-card flex flex-col"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="live-dot w-1.5 h-1.5 rounded-full bg-aurora-teal block" />
            <span className="text-[9px] font-display tracking-[0.3em] text-aurora-teal uppercase">
              Live
            </span>
          </div>
          <h2 className="font-display font-800 text-sm tracking-[0.2em] text-foreground uppercase">
            Universal Leaderboard
          </h2>
        </div>

        <div className="flex items-center gap-2 sm:ml-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search beings..."
              data-ocid="leaderboard.search_input"
              className="pl-8 h-8 text-xs bg-white/5 border-white/10 placeholder:text-muted-foreground/60 w-40 focus:border-aurora-teal/50 focus:ring-aurora-teal/20"
            />
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleDrift}
            disabled={driftMutation.isPending}
            data-ocid="leaderboard.drift.button"
            className="h-8 px-3 text-[10px] tracking-wider border-aurora-teal/30 text-aurora-teal hover:bg-aurora-teal/10 uppercase"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                driftMutation.isPending ? "animate-spin" : ""
              }`}
            />
            <span className="ml-1.5 hidden sm:inline">Drift</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-[40px_1fr_140px_90px_36px] gap-2 px-5 py-2.5 border-b border-white/5">
        {["#", "INDIVIDUAL", "DESIGNATION", "PEACE SCORE", ""].map((h) => (
          <span
            key={h}
            className="text-[9px] font-display font-600 tracking-[0.2em] text-muted-foreground uppercase"
          >
            {h}
          </span>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto max-h-[520px]">
        {isLoading ? (
          <div
            data-ocid="leaderboard.loading_state"
            className="flex items-center justify-center py-16"
          >
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="w-5 h-5 text-aurora-teal animate-spin" />
              <p className="text-xs text-muted-foreground tracking-widest uppercase">
                Scanning Universe…
              </p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div
            data-ocid="leaderboard.empty_state"
            className="flex items-center justify-center py-16"
          >
            <p className="text-xs text-muted-foreground tracking-widest uppercase">
              No beings found
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filtered.map((ind: Individual, idx: number) => {
              const rank = individuals.indexOf(ind) + 1;
              const delta = deltas.get(ind.name) ?? 0;
              const flash = flashMap.get(ind.name);
              const markerIdx = idx + 1;
              return (
                <motion.div
                  key={ind.name}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  data-ocid={`leaderboard.item.${markerIdx}`}
                  className={`grid grid-cols-[40px_1fr_140px_90px_36px] gap-2 items-center px-5 py-3 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors duration-200 ${
                    flash === "up"
                      ? "flash-up"
                      : flash === "down"
                        ? "flash-down"
                        : ""
                  }`}
                >
                  <span
                    className={`font-display font-800 text-sm tabular-nums ${getRankClass(rank)}`}
                  >
                    {rank <= 3 ? ["🥇", "🥈", "🥉"][rank - 1] : `#${rank}`}
                  </span>

                  <div className="min-w-0">
                    <p className="font-display font-600 text-sm text-foreground truncate">
                      {ind.name}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">👤</span>
                    <span className="text-[10px] text-aurora-teal font-600 tracking-wide truncate">
                      Galactic Human
                    </span>
                  </div>

                  <div className="flex flex-col items-start">
                    <span className="font-display font-800 text-lg tabular-nums score-glow-sm leading-none">
                      {Number(ind.peaceScore).toLocaleString()}
                    </span>
                    <ScoreDelta delta={delta} />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(ind.name)}
                    data-ocid={`leaderboard.delete_button.${markerIdx}`}
                    disabled={deleteMutation.isPending}
                    aria-label={`Remove ${ind.name}`}
                    className="p-1 rounded text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors duration-200 disabled:opacity-40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      <div className="px-5 py-3 border-t border-white/5">
        <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
          {filtered.length} of {individuals.length} beings displayed
        </p>
      </div>
    </motion.div>
  );
}
