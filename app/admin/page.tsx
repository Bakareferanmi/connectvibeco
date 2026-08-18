"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Compass,
  Crown,
  LogOut,
  Pencil,
  Plus,
  Ticket as TicketIcon,
  Trash2,
  Users as UsersIcon,
} from "lucide-react";
import StatTile from "@/components/admin/StatTile";
import ListingFormModal from "@/components/admin/ListingFormModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import SettingsPanel from "@/components/admin/SettingsPanel";
import AnalyticsPanel from "@/components/admin/AnalyticsPanel";
import ContentPanel from "@/components/admin/ContentPanel";
import { useAuth } from "@/lib/auth-context";
import type { EventListing, TripListing } from "@/lib/types";

const TABS = ["Overview", "Analytics", "Events", "Trips", "Users", "Bookings", "Content", "Socials"] as const;
type Tab = (typeof TABS)[number];

const ACCENT_DOT: Record<string, string> = {
  magenta: "bg-fuchsia-500",
  teal: "bg-cyan-500",
  violet: "bg-violet-500",
};

interface AdminUser {
  id: number;
  email: string;
  name: string | null;
  via_google: boolean;
  created_at: string;
}

interface AdminBookingRow {
  ticketId: string;
  itemId: string;
  title: string;
  meta: string;
  price: string;
  qty: number;
  purchasedAt: string;
  ownerEmail: string;
}

interface AdminMembershipRow {
  tierId: string;
  tierName: string;
  price: string;
  period: string;
  memberNumber: string;
  joinedAt: string;
  ownerEmail: string;
}

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<Tab>("Overview");
  const [events, setEvents] = useState<EventListing[]>([]);
  const [trips, setTrips] = useState<TripListing[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [bookings, setBookings] = useState<AdminBookingRow[]>([]);
  const [memberships, setMemberships] = useState<AdminMembershipRow[]>([]);
  const [actionError, setActionError] = useState("");

  const [editingEvent, setEditingEvent] = useState<EventListing | "new" | null>(null);
  const [editingTrip, setEditingTrip] = useState<TripListing | "new" | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ kind: "event" | "trip"; id: string; title: string } | null>(
    null
  );

  const isAdmin = !!user?.isAdmin;

  async function refresh() {
    try {
      const [eventsRes, tripsRes, usersRes, bookingsRes, membershipsRes] = await Promise.all([
        fetch("/api/events").then((r) => r.json()),
        fetch("/api/trips").then((r) => r.json()),
        fetch("/api/admin/users", { credentials: "include" }).then((r) => r.json()),
        fetch("/api/admin/bookings", { credentials: "include" }).then((r) => r.json()),
        fetch("/api/admin/memberships", { credentials: "include" }).then((r) => r.json()),
      ]);
      if (eventsRes.ok) setEvents(eventsRes.events);
      if (tripsRes.ok) setTrips(tripsRes.trips);
      if (usersRes.ok) setAdminUsers(usersRes.users);
      if (bookingsRes.ok) setBookings(bookingsRes.bookings);
      if (membershipsRes.ok) setMemberships(membershipsRes.memberships);
    } catch {
      setActionError("Could not load admin data.");
    }
  }

  useEffect(() => {
    if (isAdmin) refresh();
  }, [isAdmin]);

  const stats = useMemo(
    () => ({
      events: events.length,
      trips: trips.length,
      users: adminUsers.length,
      bookings: bookings.length,
      memberships: memberships.length,
    }),
    [events, trips, adminUsers, bookings, memberships]
  );

  async function handleSaveEvent(draft: Omit<EventListing, "id">) {
    setActionError("");
    try {
      const isNew = editingEvent === "new";
      const url = isNew ? "/api/events" : `/api/events/${(editingEvent as EventListing).id}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setActionError(data.error ?? "Could not save event.");
        return;
      }
      setEditingEvent(null);
      refresh();
    } catch {
      setActionError("Network error saving event.");
    }
  }

  async function handleSaveTrip(draft: Omit<TripListing, "id">) {
    setActionError("");
    try {
      const isNew = editingTrip === "new";
      const url = isNew ? "/api/trips" : `/api/trips/${(editingTrip as TripListing).id}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setActionError(data.error ?? "Could not save trip.");
        return;
      }
      setEditingTrip(null);
      refresh();
    } catch {
      setActionError("Network error saving trip.");
    }
  }

  async function handleDeleteConfirmed() {
    if (!deleteTarget) return;
    setActionError("");
    try {
      const url = deleteTarget.kind === "event" ? `/api/events/${deleteTarget.id}` : `/api/trips/${deleteTarget.id}`;
      const res = await fetch(url, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setActionError(data.error ?? "Could not delete.");
      }
    } catch {
      setActionError("Network error deleting.");
    }
    setDeleteTarget(null);
    refresh();
  }

  if (loading) {
    return <div className="min-h-screen bg-ink" />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-ink">
        <section className="max-w-md mx-auto px-6 pt-24 pb-24 text-center">
          <p className="text-white/60 text-[15px] mb-5">Sign in with an admin account to continue.</p>
          <Link
            href="/login?redirect=/admin"
            className="inline-block bg-fuchsia-500 hover:bg-fuchsia-400 transition-colors text-white text-[14px] font-medium px-6 py-3 rounded-full"
          >
            Sign in
          </Link>
        </section>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-ink">
        <section className="max-w-md mx-auto px-6 pt-24 pb-24 text-center">
          <p className="text-white/60 text-[15px] mb-5">
            You're signed in as {user.email}, but this account doesn't have admin access.
          </p>
          <Link href="/" className="text-fuchsia-400 text-[14px] font-medium">
            Back to site
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink text-white font-sans">
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-white/40 hover:text-white/70 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="font-display text-[15px] font-semibold tracking-tight">
              ConnectVibeCo <span className="text-white/40 font-normal">Admin</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[12px] text-white/50 hover:text-white/80 transition-colors">
              View site
            </Link>
            <span className="text-[12px] text-white/40">{user.email}</span>
          </div>
        </div>

        <nav className="max-w-6xl mx-auto px-5 flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3.5 py-2.5 text-[13px] font-medium border-b-2 whitespace-nowrap transition-colors ${
                tab === t
                  ? "border-fuchsia-500 text-white"
                  : "border-transparent text-white/45 hover:text-white/70"
              }`}
            >
              {t}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-6">
        {actionError && (
          <div className="mb-4 text-[13px] text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-xl px-4 py-2.5">
            {actionError}
          </div>
        )}

        {tab === "Overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <StatTile label="Events" value={stats.events} icon={Calendar} accent="fuchsia" />
              <StatTile label="Trips" value={stats.trips} icon={Compass} accent="cyan" />
              <StatTile label="Users" value={stats.users} icon={UsersIcon} accent="violet" />
              <StatTile label="Tickets booked" value={stats.bookings} icon={TicketIcon} accent="emerald" />
              <StatTile label="Members" value={stats.memberships} icon={Crown} accent="fuchsia" />
            </div>
            <p className="text-[12px] text-white/35 leading-relaxed max-w-xl">
              Events, trips, users, tickets, and memberships are all live from the database — changes here
              show up for every visitor immediately.
            </p>
          </div>
        )}

        {tab === "Analytics" && <AnalyticsPanel />}

        {tab === "Events" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="font-display text-[17px] font-semibold tracking-tight">Events</h1>
              <button
                onClick={() => setEditingEvent("new")}
                className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-fuchsia-500 text-[13px] font-medium hover:bg-fuchsia-400 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New event
              </button>
            </div>
            <div className="rounded-2xl bg-panel border border-white/10 overflow-hidden">
              {events.length === 0 && <EmptyRow label="No events yet." />}
              {events.map((e) => (
                <ListingRow
                  key={e.id}
                  title={e.title}
                  meta={`${e.category} · ${e.date} · ${e.location}`}
                  price={e.price}
                  spots={e.spots}
                  accent={e.accent}
                  onEdit={() => setEditingEvent(e)}
                  onDelete={() => setDeleteTarget({ kind: "event", id: e.id, title: e.title })}
                />
              ))}
            </div>
          </div>
        )}

        {tab === "Trips" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="font-display text-[17px] font-semibold tracking-tight">Trips</h1>
              <button
                onClick={() => setEditingTrip("new")}
                className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-fuchsia-500 text-[13px] font-medium hover:bg-fuchsia-400 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New trip
              </button>
            </div>
            <div className="rounded-2xl bg-panel border border-white/10 overflow-hidden">
              {trips.length === 0 && <EmptyRow label="No trips yet." />}
              {trips.map((t) => (
                <ListingRow
                  key={t.id}
                  title={t.title}
                  meta={`${t.dates} · ${t.duration} · ${t.location}`}
                  price={t.price}
                  spots={t.spots}
                  accent={t.accent}
                  onEdit={() => setEditingTrip(t)}
                  onDelete={() => setDeleteTarget({ kind: "trip", id: t.id, title: t.title })}
                />
              ))}
            </div>
          </div>
        )}

        {tab === "Users" && (
          <div>
            <h1 className="font-display text-[17px] font-semibold tracking-tight mb-4">Users</h1>
            <div className="rounded-2xl bg-panel border border-white/10 overflow-hidden">
              {adminUsers.length === 0 && <EmptyRow label="No accounts registered yet." />}
              {adminUsers.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between px-4 py-3 border-b border-white/5 last:border-0"
                >
                  <div>
                    <p className="text-[13px] text-white font-medium">{u.name ?? "—"}</p>
                    <p className="text-[12px] text-white/45">{u.email}</p>
                  </div>
                  <span className="text-[11px] px-2 py-1 rounded-full bg-white/5 text-white/50 capitalize">
                    {u.via_google ? "google" : "password"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "Bookings" && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-[17px] font-semibold tracking-tight mb-4">Tickets</h1>
              <div className="rounded-2xl bg-panel border border-white/10 overflow-hidden">
                {bookings.length === 0 && <EmptyRow label="No tickets booked yet." />}
                {bookings.map((b) => (
                  <div
                    key={b.ticketId}
                    className="flex items-center justify-between px-4 py-3 border-b border-white/5 last:border-0"
                  >
                    <div>
                      <p className="text-[13px] text-white font-medium">{b.title}</p>
                      <p className="text-[12px] text-white/45">
                        {b.ownerEmail} · {b.meta} · qty {b.qty}
                      </p>
                    </div>
                    <span className="font-mono text-[12px] text-white/50">{b.ticketId}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-display text-[17px] font-semibold tracking-tight mb-4">Memberships</h2>
              <div className="rounded-2xl bg-panel border border-white/10 overflow-hidden">
                {memberships.length === 0 && <EmptyRow label="No members yet." />}
                {memberships.map((m) => (
                  <div
                    key={m.memberNumber}
                    className="flex items-center justify-between px-4 py-3 border-b border-white/5 last:border-0"
                  >
                    <div>
                      <p className="text-[13px] text-white font-medium">{m.tierName}</p>
                      <p className="text-[12px] text-white/45">
                        {m.ownerEmail} · {m.price}/{m.period}
                      </p>
                    </div>
                    <span className="font-mono text-[12px] text-white/50">{m.memberNumber}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {tab === "Content" && <ContentPanel />}
        {tab === "Socials" && <SettingsPanel />}
      </main>

      {editingEvent && (
        <ListingFormModal
          kind="event"
          initial={editingEvent === "new" ? undefined : editingEvent}
          onClose={() => setEditingEvent(null)}
          onSave={handleSaveEvent}
        />
      )}

      {editingTrip && (
        <ListingFormModal
          kind="trip"
          initial={editingTrip === "new" ? undefined : editingTrip}
          onClose={() => setEditingTrip(null)}
          onSave={handleSaveTrip}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title={`Delete "${deleteTarget.title}"?`}
          description="This can't be undone."
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

function ListingRow({
  title,
  meta,
  price,
  spots,
  accent,
  onEdit,
  onDelete,
}: {
  title: string;
  meta: string;
  price: string;
  spots: number;
  accent: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${ACCENT_DOT[accent] ?? "bg-white/30"}`} />
        <div className="min-w-0">
          <p className="text-[13px] text-white font-medium truncate">{title}</p>
          <p className="text-[12px] text-white/45 truncate">{meta}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0 ml-3">
        <span className="text-[12px] text-white/50 hidden sm:inline">{spots} spots</span>
        <span className="font-mono text-[13px] text-white/70">{price}</span>
        <button onClick={onEdit} aria-label="Edit" className="text-white/40 hover:text-white/80 transition-colors">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button onClick={onDelete} aria-label="Delete" className="text-white/40 hover:text-rose-400 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function EmptyRow({ label }: { label: string }) {
  return <div className="px-4 py-8 text-center text-[13px] text-white/35">{label}</div>;
}
