"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/lib/toast-context";
import type { SocialLink } from "@/lib/adminStore";

const inputClass =
  "w-full h-10 rounded-xl bg-ink border border-white/10 px-3 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-fuchsia-500/50 transition-colors";

export default function SettingsPanel() {
  const { showToast } = useToast();
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/socials")
      .then((res) => res.json())
      .then((data) => data.ok && setSocials(data.socials))
      .catch(() => {});
  }, []);

  function updateSocial(key: string, updates: Partial<SocialLink>) {
    setSocials((prev) => prev.map((s) => (s.key === key ? { ...s, ...updates } : s)));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/socials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ socials }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        showToast(data.error ?? "Could not save socials");
        return;
      }
      setSocials(data.socials);
      showToast("Socials updated");
    } catch {
      showToast("Network error saving socials");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-[17px] font-semibold tracking-tight mb-4">Socials</h1>
      <div className="rounded-2xl bg-panel border border-white/10 p-4 space-y-3">
        {socials.map((s) => (
          <div key={s.key} className="flex items-center gap-3">
            <button
              onClick={() => updateSocial(s.key, { enabled: !s.enabled })}
              aria-label={s.enabled ? `Disable ${s.label}` : `Enable ${s.label}`}
              className={`w-9 h-5 rounded-full flex-shrink-0 relative transition-colors ${
                s.enabled ? "bg-fuchsia-500" : "bg-white/10"
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  s.enabled ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
            <span className="text-[13px] text-white/70 w-20 flex-shrink-0">{s.label}</span>
            <input
              className={inputClass}
              value={s.href}
              onChange={(e) => updateSocial(s.key, { href: e.target.value })}
              placeholder={`https://${s.key}.com/...`}
            />
          </div>
        ))}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full h-10 rounded-xl bg-fuchsia-500 text-[13px] font-medium text-white hover:bg-fuchsia-400 transition-colors mt-1 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save socials"}
        </button>
      </div>
    </div>
  );
}
