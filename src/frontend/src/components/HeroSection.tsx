import { Feather } from "lucide-react";
import { motion } from "motion/react";

export default function HeroSection() {
  return (
    <section id="home" className="relative z-10 text-center pt-16 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <p className="text-[11px] font-display font-600 tracking-[0.3em] text-aurora-teal uppercase mb-3">
          Universal Peace Monitor
        </p>
        <p className="text-[10px] font-display font-500 tracking-[0.4em] text-muted-foreground uppercase mb-6">
          Tracking Harmony Across The Cosmos
        </p>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-aurora-teal/60" />
          <div className="w-6 h-6 rounded-full border border-aurora-teal/40 flex items-center justify-center">
            <Feather className="w-3 h-3 text-aurora-teal" />
          </div>
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-aurora-teal/60" />
        </div>

        <h1 className="font-display font-800 text-3xl sm:text-5xl tracking-[0.12em] text-foreground uppercase mb-4">
          Cosmic Peace <span className="score-glow-sm">Dashboard</span>
        </h1>
        <p className="text-[11px] font-display tracking-[0.35em] text-muted-foreground uppercase">
          Live Rankings &nbsp;|&nbsp; Every Individual. Every World.
        </p>
      </motion.div>
    </section>
  );
}
