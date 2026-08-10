import type { LucideIcon } from "lucide-react";

interface StatTileProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent: "fuchsia" | "cyan" | "violet" | "emerald";
}

const ACCENT_STYLES: Record<StatTileProps["accent"], { icon: string; bg: string }> = {
  fuchsia: { icon: "text-fuchsia-400", bg: "bg-fuchsia-500/10" },
  cyan: { icon: "text-cyan-400", bg: "bg-cyan-500/10" },
  violet: { icon: "text-violet-400", bg: "bg-violet-500/10" },
  emerald: { icon: "text-emerald-400", bg: "bg-emerald-500/10" },
};

export default function StatTile({ label, value, icon: Icon, accent }: StatTileProps) {
  const a = ACCENT_STYLES[accent];
  return (
    <div className="rounded-2xl bg-panel border border-white/10 p-5">
      <div className={`w-9 h-9 rounded-xl ${a.bg} flex items-center justify-center mb-4`}>
        <Icon className={`w-4 h-4 ${a.icon}`} />
      </div>
      <p className="font-mono text-[26px] font-medium tracking-tight text-white mb-1">{value}</p>
      <p className="text-[12px] text-white/50">{label}</p>
    </div>
  );
}
