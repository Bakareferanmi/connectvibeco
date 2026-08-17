"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, DollarSign, Ticket as TicketIcon, TrendingUp, Crown, Eye, BarChart3, PieChart } from "lucide-react";
import StatTile from "@/components/admin/StatTile";
import BarChart from "@/components/admin/BarChart";
import DonutChart from "@/components/admin/DonutChart";
import type { AdminBookingRow, AdminMembershipRow } from "@/lib/adminStore";
import { getVisitsByDay, getTotalVisits, type VisitDay } from "@/lib/visits";
import { computeAnalytics } from "@/lib/analytics";
import type { EventListing, TripListing } from "@/lib/types";

function formatCurrency(n: number): string {
  return `£${n.toFixed(0)}`;
}

const CATEGORY_COLORS = ["#d946ef", "#22d3ee", "#a78bfa", "#34d399", "#fb923c", "#f472b6"];

export default function AnalyticsPanel() {
  const [events, setEvents] = useState<EventListing[]>([]);
  const [trips, setTrips] = useState<TripListing[]>([]);
  const [bookings, setBookings] = useState<AdminBookingRow[]>([]);
  const [memberships, setMemberships] = useState<AdminMembershipRow[]>([]);
  const [visits, setVisits] = useState<VisitDay[]>([]);
  const [totalVisits, setTotalVisits] = useState(0);
  const [categoryView, setCategoryView] = useState<"bar" | "donut">("bar");

  useEffect(() => {
    fetch("/api/events").then((r) => r.json()).then((d) => d.ok && setEvents(d.events)).catch(() => {});
    fetch("/api/trips").then((r) => r.json()).then((d) => d.ok && setTrips(d.trips)).catch(() => {});
    fetch("/api/admin/bookings", { credentials: "include" }).then((r) => r.json()).then((d) => d.ok && setBookings(d.bookings)).catch(() => {});
    fetch("/api/admin/memberships", { credentials: "include" }).then((r) => r.json()).then((d) => d.ok && setMemberships(d.memberships)).catch(() => {});
    setVisits(getVisitsByDay());
    setTotalVisits(getTotalVisits());
  }, []);

  const analytics = useMemo(
    () => computeAnalytics(bookings, memberships, events, trips),
    [bookings, memberships, events, trips]
  );

  const maxCategoryCount = Math.max(1, ...analytics.categoryBreakdown.map((c) => c.count));

  const categoryDonutData = analytics.categoryBreakdown.map((c, i) => ({
    label: c.label,
    value: c.count,
    color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatTile label="Total revenue" value={formatCurrency(analytics.totalRevenue)} icon={DollarSign} accent="emerald" />
        <StatTile label="Tickets sold" value={analytics.ticketsSold} icon={TicketIcon} accent="fuchsia" />
        <StatTile label="Avg ticket price" value={formatCurrency(analytics.avgTicketPrice)} icon={TrendingUp} accent="cyan" />
        <StatTile label="Membership revenue" value={formatCurrency(analytics.membershipRevenue)} icon={Crown} accent="violet" />
        <StatTile label="Site visits" value={totalVisits} icon={Eye} accent="cyan" />
      </div>

      <div className="rounded-2xl bg-panel border border-white/10 p-5">
        <h2 className="font-display text-[15px] font-semibold tracking-tight mb-4">
          Revenue, last 14 days
        </h2>
        {analytics.totalRevenue === 0 ? (
          <p className="text-white/40 text-[13px] py-6 text-center">No bookings yet on this device.</p>
        ) : (
          <BarChart
            data={analytics.revenueByDay.map((d) => ({ label: d.label, value: d.amount }))}
            formatValue={formatCurrency}
          />
        )}
      </div>

      <div className="rounded-2xl bg-panel border border-white/10 p-5">
        <h2 className="font-display text-[15px] font-semibold tracking-tight mb-4">
          Site visits, last 14 days
        </h2>
        {totalVisits === 0 ? (
          <p className="text-white/40 text-[13px] py-6 text-center">No visits logged yet on this device.</p>
        ) : (
          <BarChart data={visits.map((v) => ({ label: v.label, value: v.count }))} />
        )}
        <p className="text-[11px] text-white/30 mt-3">
          Counted once per browser session, so refreshes and page-to-page navigation don&apos;t inflate the number.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-panel border border-white/10 p-5">
          <h2 className="font-display text-[15px] font-semibold tracking-tight mb-4">Top listings</h2>
          {analytics.topItems.length === 0 ? (
            <p className="text-white/40 text-[13px] py-4 text-center">Nothing booked yet.</p>
          ) : (
            <div className="space-y-3">
              {analytics.topItems.map((item, i) => (
                <div key={item.itemId} className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-white/30 w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-white truncate">{item.title}</p>
                  </div>
                  <span className="text-[12px] text-white/50">{item.bookings} booked</span>
                  <span className="font-mono text-[12px] text-white/70 w-14 text-right">
                    {formatCurrency(item.revenue)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-panel border border-white/10 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-[15px] font-semibold tracking-tight">Listings by category</h2>
            <div className="flex items-center gap-1 bg-white/5 rounded-full p-1">
              <button
                onClick={() => setCategoryView("bar")}
                aria-label="Bar view"
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                  categoryView === "bar" ? "bg-white text-black" : "text-white/50 hover:text-white/80"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCategoryView("donut")}
                aria-label="Donut view"
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                  categoryView === "donut" ? "bg-white text-black" : "text-white/50 hover:text-white/80"
                }`}
              >
                <PieChart className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {analytics.categoryBreakdown.length === 0 ? (
            <p className="text-white/40 text-[13px] py-4 text-center">No listings yet.</p>
          ) : categoryView === "bar" ? (
            <div className="space-y-2.5">
              {analytics.categoryBreakdown.map((c) => (
                <div key={c.label} className="flex items-center gap-3">
                  <span className="text-[12px] text-white/60 w-20 flex-shrink-0 truncate">{c.label}</span>
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-cyan-500/70"
                      style={{ width: `${(c.count / maxCategoryCount) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-[12px] text-white/50 w-5 text-right">{c.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <DonutChart data={categoryDonutData} />
          )}
        </div>
      </div>

      {analytics.lowInventory.length > 0 && (
        <div className="rounded-2xl bg-panel border border-white/10 p-5">
          <h2 className="font-display text-[15px] font-semibold tracking-tight mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            Low on spots
          </h2>
          <div className="space-y-2">
            {analytics.lowInventory.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-[13px]">
                <span className="text-white/70">{item.title}</span>
                <span className="font-mono text-orange-400">{item.spots} left</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-[12px] text-white/35 leading-relaxed max-w-xl">
        Bookings and memberships are calculated from the database across all devices. Site visits are still
        counted per-browser.
      </p>
    </div>
  );
}
