"use client";

import { useEffect, useState } from "react";
import type { Ticket } from "@/lib/types";

const STORAGE_KEY = "connectvibe:bookings";

function readTickets(): Ticket[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeTickets(tickets: Ticket[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
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
  const [ticket, setTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    const existing = readTickets().find((t) => t.itemId === itemId);
    setTicket(existing ?? null);
  }, [itemId]);

  function book(details: BookDetails): Ticket {
    const existing = readTickets();
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
    writeTickets([...existing, newTicket]);
    setTicket(newTicket);
    return newTicket;
  }

  return { booked: !!ticket, ticket, book };
}
