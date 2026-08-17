"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Check, Sparkles } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MembershipModal from "@/components/MembershipModal";
import { useAuth } from "@/lib/auth-context";
import { useMembership } from "@/lib/useMembership";
import { useToast } from "@/lib/toast-context";

type TierAccent = "violet" | "teal" | "magenta";

interface Tier {
  id: string;
  name: string;
  price: string;
  period: string;
  perMonth: string;
  tagline: string;
  badge?: string;
  accent: TierAccent;
  benefits: string[];
}

const ACCENTS: Record<TierAccent, { text: string; bg: string; border: string; ring: string }> = {
  violet: { text: "text-violet-400", bg: "bg-violet-500", border: "border-violet-500/30", ring: "ring-violet-500/40" },
  teal: { text: "text-cyan-400", bg: "bg-cyan-500", border: "border-cyan-500/30", ring: "ring-cyan-500/40" },
  magenta: { text: "text-fuchsia-400", bg: "bg-fuchsia-500", border: "border-fuchsia-500/40", ring: "ring-fuchsia-500/50" },
};

const TIERS: Tier[] = [
  {
    id: "monthly",
    name: "Monthly",
    price: "£4.99",
    period: "/month",
    perMonth: "£4.99 per month",
    tagline: "Try it out, cancel anytime",
    accent: "violet",
    benefits: [
      "Priority access to limited-spot events",
      "Member pricing on select trips",
      "Early invites before events go public",
    ],
  },
  {
    id: "quarterly",
    name: "Quarterly",
    price: "£12.99",
    period: "/3 months",
    perMonth: "£4.33 per month · save 13%",
    tagline: "The middle ground",
    badge: "Most popular",
    accent: "teal",
    benefits: [
      "Everything in Monthly",
      "5% off every booking",
      "One free guest pass per quarter",
      "Access to members-only socials",
    ],
  },
  {
    id: "yearly",
    name: "Yearly",
    price: "£39.99",
    period: "/year",
    perMonth: "£3.33 per month · save 33%",
    tagline: "For the regulars",
    badge: "Best value",
    accent: "magenta",
    benefits: [
      "Everything in Quarterly",
      "10% off every booking",
      "Two free guest passes per year",
      "First pick on wait-listed trips",
      "A welcome gift when you join",
    ],
  },
];

export default function MembershipPage() {
  const { user } = useAuth();
  const { membership, join } = useMembership();
  const { showToast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [activeTier, setActiveTier] = useState<Tier | null>(null);

  function handleJoinClick(tier: Tier) {
    if (!user) {
      showToast("Sign in to join membership");
      router.push(`/login?reason=membership&redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (membership?.tierId === tier.id) return;
    setActiveTier(tier);
  }

  async function handleConfirmed() {
    if (!activeTier) return null;
    return join(activeTier.id, activeTier.name, activeTier.price, activeTier.period);
  }

  return (
    <div className="min-h-screen bg-ink">
      <Nav />

      <section className="max-w-6xl mx-auto px-6 pt-10 pb-8">
        <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-white/50 mb-3">
          Membership
        </p>
        <h1 className="font-display text-[32px] sm:text-[44px] font-semibold tracking-tight leading-[1.1] mb-4">
          One membership, every event and trip
        </h1>
        <p className="text-white/60 text-[15px] leading-relaxed max-w-xl">
          Priority access, member pricing, and invites before things go public. Pick a plan that fits how often you show up.
        </p>
        {membership && (
          <p className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full">
            <Check className="w-3.5 h-3.5" />
            {membership.tierName} plan active
          </p>
        )}
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid sm:grid-cols-3 gap-5">
          {TIERS.map((tier) => {
            const a = ACCENTS[tier.accent];
            const highlighted = tier.id === "yearly";
            const isCurrent = membership?.tierId === tier.id;
            return (
              <div
                key={tier.id}
                className={`relative rounded-2xl bg-panel border p-6 flex flex-col ${
                  highlighted ? `${a.border} ring-1 ${a.ring}` : "border-white/10"
                }`}
              >
                {tier.badge && !isCurrent && (
                  <span
                    className={`absolute -top-3 left-6 flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.1em] px-2.5 py-1 rounded-full ${a.bg} text-white`}
                  >
                    {highlighted && <Sparkles className="w-3 h-3" />}
                    {tier.badge}
                  </span>
                )}
                {isCurrent && (
                  <span className="absolute -top-3 left-6 flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.1em] px-2.5 py-1 rounded-full bg-emerald-500 text-white">
                    <Check className="w-3 h-3" />
                    Current plan
                  </span>
                )}

                <p className={`font-mono text-[11px] uppercase tracking-[0.15em] mb-2 ${a.text}`}>
                  {tier.name}
                </p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-display text-[32px] font-semibold tracking-tight">{tier.price}</span>
                  <span className="text-white/50 text-[14px]">{tier.period}</span>
                </div>
                <p className="text-white/50 text-[12px] mb-1">{tier.perMonth}</p>
                <p className="text-white/50 text-[13px] mb-6">{tier.tagline}</p>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2.5 text-[13px] text-white/70">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${a.text}`} />
                      {benefit}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleJoinClick(tier)}
                  disabled={isCurrent}
                  className={`w-full text-[14px] font-medium px-6 py-3 rounded-full transition-colors ${
                    isCurrent
                      ? "bg-white/10 text-white/50 cursor-default"
                      : highlighted
                      ? `${a.bg} text-white hover:opacity-90`
                      : "bg-white/5 text-white/80 hover:bg-white/10"
                  }`}
                >
                  {isCurrent ? "Current plan" : `Join ${tier.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-24">
        <p className="text-white/50 text-[13px] leading-relaxed">
          This is a demo checkout — no real charge is made.
        </p>
      </section>

      <Footer />

      {activeTier && (
        <MembershipModal
          tierName={activeTier.name}
          price={activeTier.price}
          period={activeTier.period}
          onClose={() => setActiveTier(null)}
          onConfirm={handleConfirmed}
        />
      )}
    </div>
  );
}
