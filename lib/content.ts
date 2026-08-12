const HERO_KEY = "connectvibe:admin:hero";
const FAQ_KEY = "connectvibe:admin:faq";
const TESTIMONIALS_KEY = "connectvibe:admin:testimonials";

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable - ignore
  }
}

function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
}

/* ---------------- Homepage hero ---------------- */

export interface HeroContent {
  eyebrow: string;
  headlineMain: string;
  headlineAccent: string;
  subtext: string;
  ctaLabel: string;
  ctaHref: string;
}

export const DEFAULT_HERO: HeroContent = {
  eyebrow: "487 people going out this week",
  headlineMain: "Find your people.",
  headlineAccent: "Show up.",
  subtext:
    "Local meetups, weekend trips, and nights out. Vetted, bookable, and full of strangers worth meeting.",
  ctaLabel: "Browse events",
  ctaHref: "/events",
};

export function getHero(): HeroContent {
  return readJSON<HeroContent>(HERO_KEY, DEFAULT_HERO);
}

export function saveHero(hero: HeroContent) {
  writeJSON(HERO_KEY, hero);
}

/* ---------------- FAQ ---------------- */

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const DEFAULT_FAQS: FaqItem[] = [
  {
    id: "faq-1",
    question: "How do I book a spot at an event or trip?",
    answer:
      "Open any event or trip page and tap Book spot. Pick how many spots you need, confirm payment, and you'll get a ticket with a QR code right away.",
  },
  {
    id: "faq-2",
    question: "Where can I find my ticket after booking?",
    answer:
      "Your ticket stays on the event or trip page you booked, and every ticket you've ever booked lives on your Bookings page, each with its own QR code and a download button.",
  },
  {
    id: "faq-3",
    question: "Can I cancel a booking?",
    answer:
      "Cancellations aren't self-service yet. If you need to cancel or change a booking, reach out through the Contact page and we'll sort it out.",
  },
  {
    id: "faq-4",
    question: "What do I get with membership?",
    answer:
      "Membership unlocks priority access to limited-spot events, discounted pricing on bookings, and free guest passes, with better perks the longer your plan. Check the Membership page for the full breakdown by tier.",
  },
  {
    id: "faq-5",
    question: "Is my payment information secure?",
    answer: "Yes. Payments are processed securely and we never store your full card details.",
  },
  {
    id: "faq-6",
    question: "How do I save something for later?",
    answer:
      "Tap Save on any event or trip page. Everything you save shows up on your Saved page and on your dashboard.",
  },
];

export function getFaqs(): FaqItem[] {
  return readJSON<FaqItem[]>(FAQ_KEY, DEFAULT_FAQS);
}

export function saveFaqs(items: FaqItem[]) {
  writeJSON(FAQ_KEY, items);
}

export function newFaqItem(): FaqItem {
  return { id: makeId("faq"), question: "", answer: "" };
}

/* ---------------- Testimonials ---------------- */

export type TestimonialAccent = "fuchsia" | "violet" | "cyan";

export interface TestimonialItem {
  id: string;
  quote: string;
  name: string;
  context: string;
  accent: TestimonialAccent;
}

export const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "t-1",
    quote:
      "Booked a rooftop night on a whim and left with three new friends and a running club invite.",
    name: "Dara O.",
    context: "Member since 2025",
    accent: "fuchsia",
  },
  {
    id: "t-2",
    quote: "The waiver and payment flow took under a minute. Everything after that was the easy part.",
    name: "Femi A.",
    context: "Booked 6 trips",
    accent: "violet",
  },
  {
    id: "t-3",
    quote: "I moved to a new city and didn't know a single person. Three weeks in, my calendar was full.",
    name: "Priya S.",
    context: "Member since 2024",
    accent: "cyan",
  },
];

export function getTestimonials(): TestimonialItem[] {
  return readJSON<TestimonialItem[]>(TESTIMONIALS_KEY, DEFAULT_TESTIMONIALS);
}

export function saveTestimonials(items: TestimonialItem[]) {
  writeJSON(TESTIMONIALS_KEY, items);
}

export function newTestimonialItem(): TestimonialItem {
  return { id: makeId("t"), quote: "", name: "", context: "", accent: "fuchsia" };
}
