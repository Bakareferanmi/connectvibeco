"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "connectvibe:membership";

export interface Membership {
  tierId: string;
  tierName: string;
  price: string;
  period: string;
  joinedAt: string;
}

function readMembership(): Membership | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeMembership(m: Membership) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(m));
}

export function useMembership() {
  const [membership, setMembership] = useState<Membership | null>(null);

  useEffect(() => {
    setMembership(readMembership());
  }, []);

  function join(tierId: string, tierName: string, price: string, period: string): Membership {
    const record: Membership = {
      tierId,
      tierName,
      price,
      period,
      joinedAt: new Date().toISOString(),
    };
    writeMembership(record);
    setMembership(record);
    return record;
  }

  return { membership, join };
}
