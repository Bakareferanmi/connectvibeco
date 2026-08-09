"use client";

import { useEffect, useState } from "react";
import type { Ticket } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

function storageKey(email?: string) {
  return `connectvibe:bookings:${email ?? "guest"}`;
}

function readTickets(key: string): Ticket[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeTickets(key: string, tickets: Ticket[]) {
  try {
    localStorage.setItem(key, JSON.stringify(tickets));
  } catch {
    // storage unavailable - ignore
  }
}

function makeCode(): string {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const digits = "23456789";
  const all = letters + digits;
  const chars: string[] = [
    letters[Math.floor(Math.random() * letters.length)],
    digits[Math.floor(Math.random() * digits.length)],
  ];
  while (chars.length < 5) {
    chars.push(all[Math.floor(Math.random() * all.length)]);
  }
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return `CVC-${chars.join("")}`;
}

function generateTicketId(existing: Ticket[]): string {
  const usedIds = new Set(existing.map((t) => t.ticketId));
  let code = makeCode();
  while (usedIds.has(code)) {
    code = makeCode();
  }
  return code;
}

interface BookDetails {
  title: string;
  meta: string;
  price: string;
  qty: number;
}

export function useBooking(itemId: string) {
  const { user } = useAuth();
  const key = storageKey(user?.email);
  const [ticket, setTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    const existing = readTickets(key).find((t) => t.itemId === itemId);
    setTicket(existing ?? null);
  }, [itemId, key]);

  function book(details: BookDetails): Ticket {
    const existing = readTickets(key);
    const already = existing.find((t) => t.itemId === itemId);
    if (already) {
      setTicket(already);
      return already;
    }
    const newTicket: Ticket = {
      ticketId: generateTicketId(existing),
      itemId,
      title: details.title,
      meta: details.meta,
      price: details.price,
      qty: details.qty,
      purchasedAt: new Date().toISOString(),
    };
    writeTickets(key, [...existing, newTicket]);
    setTicket(newTicket);
    return newTicket;
  }

  return { booked: !!ticket, ticket, book };
}
