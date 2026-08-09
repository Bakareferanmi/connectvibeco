"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

function storageKey(email?: string) {
  return `connectvibe:saved:${email ?? "guest"}`;
}

function readSaved(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useSaved(id: string) {
  const { user } = useAuth();
  const key = storageKey(user?.email);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(readSaved(key).includes(id));
  }, [id, key]);

  function toggle(e?: React.MouseEvent) {
    e?.preventDefault();
    e?.stopPropagation();
    const current = readSaved(key);
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // storage unavailable (e.g. private browsing quota) - ignore
    }
    setSaved(next.includes(id));
  }

  return { saved, toggle };
}
