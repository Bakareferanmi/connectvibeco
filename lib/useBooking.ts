"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "connectvibe:bookings";

function readBookings(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useBooking(id: string) {
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    setBooked(readBookings().includes(id));
  }, [id]);

  function book() {
    const current = readBookings();
    if (current.includes(id)) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, id]));
    setBooked(true);
  }

  return { booked, book };
}
