"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

export function useSaved(id: string) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) {
      setSaved(false);
      return;
    }
    fetch("/api/saved", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setSaved((data.savedIds as string[]).includes(id));
      })
      .catch(() => {});
  }, [id, user]);

  async function toggle(e?: React.MouseEvent) {
    e?.preventDefault();
    e?.stopPropagation();
    if (!user) return;
    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ itemId: id }),
      });
      const data = await res.json();
      if (res.ok && data.ok) setSaved(data.saved);
    } catch {
      // network error - leave state unchanged
    }
  }

  return { saved, toggle };
}
