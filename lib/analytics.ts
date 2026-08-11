import type { AdminBookingRow, AdminMembershipRow } from "@/lib/adminStore";
import type { EventListing, TripListing } from "@/lib/types";

export function parsePrice(priceStr: string): number {
  const digits = priceStr.replace(/[^0-9.]/g, "");
  return digits ? parseFloat(digits) : 0;
}

export interface DayRevenue {
  label: string;
  date: string;
  amount: number;
}

export interface TopItem {
  itemId: string;
  title: string;
  bookings: number;
  revenue: number;
}

export interface CategorySlice {
  label: string;
  count: number;
}

export interface AnalyticsSummary {
  ticketRevenue: number;
  membershipRevenue: number;
  totalRevenue: number;
  ticketsSold: number;
  avgTicketPrice: number;
  revenueByDay: DayRevenue[];
  topItems: TopItem[];
  categoryBreakdown: CategorySlice[];
  lowInventory: { id: string; title: string; spots: number; kind: "event" | "trip" }[];
}

const DAYS_WINDOW = 14;

export function computeAnalytics(
  bookings: AdminBookingRow[],
  memberships: AdminMembershipRow[],
  events: EventListing[],
  trips: TripListing[]
): AnalyticsSummary {
  const ticketRevenue = bookings.reduce((sum, b) => sum + parsePrice(b.price) * b.qty, 0);
  const membershipRevenue = memberships.reduce((sum, m) => sum + parsePrice(m.price), 0);
  const ticketsSold = bookings.reduce((sum, b) => sum + b.qty, 0);
  const avgTicketPrice = ticketsSold > 0 ? ticketRevenue / ticketsSold : 0;

  const now = new Date();
  const dayBuckets = new Map<string, number>();
  for (let i = DAYS_WINDOW - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dayBuckets.set(d.toISOString().slice(0, 10), 0);
  }
  bookings.forEach((b) => {
    const key = (b.purchasedAt || "").slice(0, 10);
    if (dayBuckets.has(key)) {
      dayBuckets.set(key, (dayBuckets.get(key) || 0) + parsePrice(b.price) * b.qty);
    }
  });
  const revenueByDay: DayRevenue[] = Array.from(dayBuckets.entries()).map(([date, amount]) => ({
    date,
    amount,
    label: new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
  }));

  const itemMap = new Map<string, TopItem>();
  bookings.forEach((b) => {
    const existing = itemMap.get(b.itemId);
    const revenue = parsePrice(b.price) * b.qty;
    if (existing) {
      existing.bookings += b.qty;
      existing.revenue += revenue;
    } else {
      itemMap.set(b.itemId, { itemId: b.itemId, title: b.title, bookings: b.qty, revenue });
    }
  });
  const topItems = Array.from(itemMap.values())
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 5);

  const categoryCounts = new Map<string, number>();
  events.forEach((e) => {
    categoryCounts.set(e.category, (categoryCounts.get(e.category) || 0) + 1);
  });
  if (trips.length > 0) categoryCounts.set("Trips", trips.length);
  const categoryBreakdown: CategorySlice[] = Array.from(categoryCounts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);

  const LOW_SPOTS_THRESHOLD = 3;
  const lowInventory = [
    ...events
      .filter((e) => e.spots <= LOW_SPOTS_THRESHOLD)
      .map((e) => ({ id: e.id, title: e.title, spots: e.spots, kind: "event" as const })),
    ...trips
      .filter((t) => t.spots <= LOW_SPOTS_THRESHOLD)
      .map((t) => ({ id: t.id, title: t.title, spots: t.spots, kind: "trip" as const })),
  ].sort((a, b) => a.spots - b.spots);

  return {
    ticketRevenue,
    membershipRevenue,
    totalRevenue: ticketRevenue + membershipRevenue,
    ticketsSold,
    avgTicketPrice,
    revenueByDay,
    topItems,
    categoryBreakdown,
    lowInventory,
  };
}
