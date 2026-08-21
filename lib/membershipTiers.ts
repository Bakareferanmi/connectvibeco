// Single source of truth for membership tiers — imported by both the
// membership page (client) and the /api/membership route (server). Keeping
// one canonical list means the API can validate a submitted tierId against
// real price/name/period instead of trusting whatever the client sends.

export type TierAccent = "violet" | "teal" | "magenta";

export interface Tier {
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

export const TIERS: Tier[] = [
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

export function getTierById(tierId: string): Tier | undefined {
  return TIERS.find((t) => t.id === tierId);
}
