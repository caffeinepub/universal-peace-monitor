import { Button } from "@/components/ui/button";
import { Feather } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const NAV_LINKS = [
  { label: "HOME", href: "#home" },
  { label: "RANKINGS", href: "#leaderboard" },
  { label: "MY SCORE", href: "#my-score" },
  { label: "ABOUT", href: "#about" },
  { label: "GLOBAL IMPACT", href: "#stats" },
];

export default function Header() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;

  return (
    <header className="sticky top-0 z-50 w-full">
      <div
        className="w-full border-b border-white/5"
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,10,18,0.92) 0%, rgba(5,10,18,0.75) 100%)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-full bg-aurora-teal/10 border border-aurora-teal/30 flex items-center justify-center shadow-glow-sm">
              <Feather className="w-4 h-4 text-aurora-teal" />
            </div>
            <div className="leading-none">
              <div className="text-[10px] font-display font-700 tracking-[0.25em] text-muted-foreground uppercase">
                Universal
              </div>
              <div className="text-[11px] font-display font-800 tracking-[0.2em] text-foreground uppercase">
                Peace Monitor
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav
            className="hidden md:flex items-center gap-6"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                data-ocid={`nav.${link.label.toLowerCase().replace(" ", "_")}.link`}
                className="text-[11px] font-display font-600 tracking-[0.18em] text-muted-foreground hover:text-aurora-teal transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-aurora-teal group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Auth */}
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-[11px] text-muted-foreground font-mono truncate max-w-[100px]">
                {identity?.getPrincipal().toString().slice(0, 8)}…
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={clear}
                data-ocid="auth.sign_out.button"
                className="text-[11px] tracking-widest uppercase border-aurora-teal/30 text-aurora-teal hover:bg-aurora-teal/10 rounded-full px-4"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={login}
              disabled={loginStatus === "logging-in"}
              data-ocid="auth.sign_in.button"
              className="text-[11px] tracking-widest uppercase bg-aurora-teal/10 hover:bg-aurora-teal/20 border border-aurora-teal/40 text-aurora-teal rounded-full px-5 shadow-glow-sm"
            >
              {loginStatus === "logging-in" ? "CONNECTING..." : "SIGN IN"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
