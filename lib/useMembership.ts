"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

export interface Membership {
  tierId: string;
  tierName: string;
  price: string;
  period: string;
  joinedAt: string;
  memberNumber: string;
}

function storageKey(email?: string) {
  return `connectvibe:membership:${email ?? "guest"}`;
}

function readMembership(key: string): Membership | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeMembership(key: string, m: Membership) {
  try {
    localStorage.setItem(key, JSON.stringify(m));
  } catch {
    // storage unavailable - ignore
  }
}

function generateMemberNumber(): string {
  const digits = "0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += digits[Math.floor(Math.random() * digits.length)];
  }
  return `CVC-${code}`;
}

export function useMembership() {
  const { user } = useAuth();
  const key = storageKey(user?.email);
  const [membership, setMembership] = useState<Membership | null>(null);

  useEffect(() => {
    setMembership(readMembership(key));
  }, [key]);

  function join(tierId: string, tierName: string, price: string, period: string): Membership {
    const record: Membership = {
      tierId,
      tierName,
      price,
      period,
      joinedAt: new Date().toISOString(),
      memberNumber: generateMemberNumber(),
    };
    writeMembership(key, record);
    setMembership(record);
    return record;
  }

  return { membership, join };
}
