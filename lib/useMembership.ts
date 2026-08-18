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

export function useMembership() {
  const { user } = useAuth();
  const [membership, setMembership] = useState<Membership | null>(null);

  useEffect(() => {
    if (!user) {
      setMembership(null);
      return;
    }
    fetch("/api/membership", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setMembership(data.membership);
      })
      .catch(() => {});
  }, [user]);

  async function join(tierId: string, tierName: string, price: string, period: string): Promise<Membership | null> {
    if (!user) return null;
    try {
      const res = await fetch("/api/membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ tierId, tierName, price, period }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) return null;
      setMembership(data.membership);
      return data.membership;
    } catch {
      return null;
    }
  }

  return { membership, join };
}
