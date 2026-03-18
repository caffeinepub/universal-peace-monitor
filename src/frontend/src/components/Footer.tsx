import { Heart } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="relative z-10 border-t border-white/5 mt-16 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[10px] font-display tracking-[0.2em] text-muted-foreground uppercase">
          © {year} Universal Peace Monitor
        </p>
        <p className="text-[10px] font-display tracking-[0.15em] text-muted-foreground uppercase flex items-center gap-1.5">
          Built with{" "}
          <Heart className="w-3 h-3 text-aurora-teal fill-aurora-teal" /> using{" "}
          <a
            href={utmLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-aurora-teal hover:text-aurora-cyan transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
