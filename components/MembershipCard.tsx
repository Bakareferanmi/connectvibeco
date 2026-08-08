"use client";

import { useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import type { Membership } from "@/lib/useMembership";

interface MembershipCardProps {
  membership: Membership;
}

const TIER_GRADIENTS: Record<string, string> = {
  monthly: "from-violet-600 via-purple-600 to-indigo-700",
  quarterly: "from-cyan-600 via-teal-600 to-emerald-700",
  yearly: "from-fuchsia-600 via-pink-600 to-rose-700",
};

function formatJoinDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export default function MembershipCard({ membership }: MembershipCardProps) {
  const { user } = useAuth();
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const gradient = TIER_GRADIENTS[membership.tierId] ?? TIER_GRADIENTS.monthly;

  async function handleDownload() {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `connect-vibe-membership-${membership.memberNumber}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // Download silently fails; button state resets below.
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div>
      <div
        ref={cardRef}
        className={`relative aspect-[1.6/1] w-full rounded-2xl bg-gradient-to-br ${gradient} p-5 overflow-hidden`}
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(255,255,255,0.15) 0%, transparent 45%)",
          }}
        />
        <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full border border-white/20" />
        <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full border border-white/20" />

        <div className="relative h-full flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <img src="/CVC-white.png" alt="" className="w-7 h-7 flex-shrink-0" crossOrigin="anonymous" />
              <div>
                <p className="font-display font-semibold text-white text-[15px] tracking-tight">
                  connect vibe
                </p>
                <p className="text-white/60 text-[9px] font-mono uppercase tracking-[0.2em] mt-0.5">
                  Member
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-white bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-full">
              {membership.tierName}
            </span>
          </div>

          <div>
            <p className="font-mono text-white text-[16px] tracking-[0.15em] mb-3">
              {membership.memberNumber}
            </p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white/50 text-[8px] font-mono uppercase tracking-[0.15em] mb-0.5">
                  Member name
                </p>
                <p className="font-display text-white text-[15px] font-medium truncate max-w-[160px]">
                  {user?.name ?? "Member"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white/50 text-[8px] font-mono uppercase tracking-[0.15em] mb-0.5">
                  Since
                </p>
                <p className="text-white text-[13px]">{formatJoinDate(membership.joinedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleDownload}
        disabled={downloading}
        className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 transition-colors text-white/80 text-[13px] font-medium px-4 py-2.5 rounded-full mt-3 disabled:opacity-60"
      >
        {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
        {downloading ? "Preparing image" : "Download card"}
      </button>
    </div>
  );
}
