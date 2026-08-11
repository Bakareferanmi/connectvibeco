"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, DollarSign, Ticket as TicketIcon, TrendingUp, Crown } from "lucide-react";
import StatTile from "@/components/admin/StatTile";
import BarChart from "@/components/admin/BarChart";
import {
  getEvents,
  getTrips,
  getAllBookings,
  getAllMemberships,
  type AdminBookingRow,
  type AdminMembershipRow,
} from "@/lib/adminStore";
import { computeAnalytics } from "@/lib/analytics";
import type { EventListing, TripListing } from "@/lib/types";

function formatCurrency(n: number): string {
  return `£${n.toFixed(0)}`;
}

export default function AnalyticsPanel() {
  const [events, setEvents] = useState<EventListing[]>([]);
  const [trips, setTrips] = useState<TripListing[]>([]);
  const [bookings, setBookings] = useState<AdminBookingRow[]>([]);
  const [memberships, setMemberships] = useState<AdminMembershipRow[]>([]);

  useEffect(() => {
    setEvents(getEvents());
    setTrips(getTrips());
    setBookings(getAllBookings());
    setMemberships(getAllMemberships());
  }, []);

  const analytics = useMemo(
    () => computeAnalytics(bookings, memberships, events, trips),
    [bookings, memberships, events, trips]
  );

  const maxCategoryCount = Math.max(1, ...analytics.categoryBreakdown.map((c) => c.count));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile label="Total revenue" value={formatCurrency(analytics.totalRevenue)} icon={DollarSign} accent="emerald" />
        <StatTile label="Tickets sold" value={analytics.ticketsSold} icon={TicketIcon} accent="fuchsia" />
        <StatTile label="Avg ticket price" value={formatCurrency(analytics.avgTicketPrice)} icon={TrendingUp} accent="cyan" />
        <StatTile label="Membership revenue" value={formatCurrency(analytics.membershipRevenue)} icon={Crown} accent="violet" />
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
          <h2 className="font-display text-[15px] font-semibold tracking-tight mb-4">Listings by category</h2>
          {analytics.categoryBreakdown.length === 0 ? (
            <p className="text-white/40 text-[13px] py-4 text-center">No listings yet.</p>
          ) : (
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
        Calculated from this browser&apos;s local storage — bookings and memberships made on other devices
        aren&apos;t counted.
      </p>
    </div>
  );
}
