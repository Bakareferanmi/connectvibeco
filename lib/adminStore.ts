import { EVENTS, TRIPS } from "@/lib/data";
import type { EventListing, TripListing, Ticket } from "@/lib/types";
import type { Membership } from "@/lib/useMembership";

const EVENTS_KEY = "connectvibe:admin:events";
const TRIPS_KEY = "connectvibe:admin:trips";
const USERS_KEY = "cvc_users";
const BOOKINGS_PREFIX = "connectvibe:bookings:";
const MEMBERSHIP_PREFIX = "connectvibe:membership:";

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

/* ---------------- Events ---------------- */

export function getEvents(): EventListing[] {
  return readJSON<EventListing[]>(EVENTS_KEY, EVENTS);
}

export function saveEvents(events: EventListing[]) {
  writeJSON(EVENTS_KEY, events);
}

export function createEvent(input: Omit<EventListing, "id">): EventListing {
  const events = getEvents();
  const created: EventListing = { ...input, id: makeId("evt") };
  saveEvents([created, ...events]);
  return created;
}

export function updateEvent(id: string, updates: Partial<EventListing>): void {
  const events = getEvents().map((e) => (e.id === id ? { ...e, ...updates, id } : e));
  saveEvents(events);
}

export function deleteEvent(id: string): void {
  saveEvents(getEvents().filter((e) => e.id !== id));
}

/* ---------------- Trips ---------------- */

export function getTrips(): TripListing[] {
  return readJSON<TripListing[]>(TRIPS_KEY, TRIPS);
}

export function saveTrips(trips: TripListing[]) {
  writeJSON(TRIPS_KEY, trips);
}

export function createTrip(input: Omit<TripListing, "id">): TripListing {
  const trips = getTrips();
  const created: TripListing = { ...input, id: makeId("trp") };
  saveTrips([created, ...trips]);
  return created;
}

export function updateTrip(id: string, updates: Partial<TripListing>): void {
  const trips = getTrips().map((t) => (t.id === id ? { ...t, ...updates, id } : t));
  saveTrips(trips);
}

export function deleteTrip(id: string): void {
  saveTrips(getTrips().filter((t) => t.id !== id));
}

/* ---------------- Users ---------------- */

export interface AdminUserRow {
  name: string;
  email: string;
  provider: "password" | "google";
  city?: string;
}

export function getUsers(): AdminUserRow[] {
  interface StoredUser extends AdminUserRow {
    password: string | null;
  }
  return readJSON<StoredUser[]>(USERS_KEY, []).map((u) => ({
    name: u.name,
    email: u.email,
    provider: u.provider,
    city: u.city,
  }));
}

/* ---------------- Bookings & Memberships (read-only aggregation) ---------------- */

export interface AdminBookingRow extends Ticket {
  ownerEmail: string;
}

export function getAllBookings(): AdminBookingRow[] {
  if (typeof window === "undefined") return [];
  const rows: AdminBookingRow[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(BOOKINGS_PREFIX)) continue;
    const ownerEmail = key.slice(BOOKINGS_PREFIX.length);
    const tickets = readJSON<Ticket[]>(key, []);
    tickets.forEach((t) => rows.push({ ...t, ownerEmail }));
  }
  return rows.sort((a, b) => (a.purchasedAt < b.purchasedAt ? 1 : -1));
}

export interface AdminMembershipRow extends Membership {
  ownerEmail: string;
}

export function getAllMemberships(): AdminMembershipRow[] {
  if (typeof window === "undefined") return [];
  const rows: AdminMembershipRow[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(MEMBERSHIP_PREFIX)) continue;
    const ownerEmail = key.slice(MEMBERSHIP_PREFIX.length);
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    try {
      const m = JSON.parse(raw) as Membership;
      rows.push({ ...m, ownerEmail });
    } catch {
      // skip malformed entry
    }
  }
  return rows.sort((a, b) => (a.joinedAt < b.joinedAt ? 1 : -1));
}
