"use client";

import { useEffect, useState } from "react";
import type { Ticket } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

interface BookDetails {
  title: string;
  meta: string;
  price: string;
  qty: number;
}

export function useBooking(itemId: string) {
  const { user } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    if (!user) {
      setTicket(null);
      return;
    }
    fetch("/api/bookings", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          const existing = (data.tickets as Ticket[]).find((t) => t.itemId === itemId);
          setTicket(existing ?? null);
        }
      })
      .catch(() => {});
  }, [itemId, user]);

  async function book(details: BookDetails): Promise<Ticket | null> {
    if (!user) return null;
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ itemId, ...details }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) return null;
      setTicket(data.ticket);
      return data.ticket;
    } catch {
      return null;
    }
  }

  return { booked: !!ticket, ticket, book };
}
