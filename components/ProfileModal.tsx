"use client";

import { useRef, useState } from "react";
import { X, Upload, Check } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Avatar, { AVATAR_PRESETS } from "@/components/Avatar";

const PRONOUN_OPTIONS = ["She/her", "He/him", "They/them", "Ask me"];
const ORIENTATION_OPTIONS = [
  "Straight",
  "Gay",
  "Lesbian",
  "Bisexual",
  "Pansexual",
  "Asexual",
  "Queer",
  "Prefer not to say",
];

export default function ProfileModal({ onClose }: { onClose: () => void }) {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? "");
  const [avatarPreset, setAvatarPreset] = useState(user?.avatarPreset ?? "magenta");
  const [pronouns, setPronouns] = useState(
    user?.pronouns && !PRONOUN_OPTIONS.includes(user.pronouns) ? "custom" : user?.pronouns ?? ""
  );
  const [customPronouns, setCustomPronouns] = useState(
    user?.pronouns && !PRONOUN_OPTIONS.includes(user.pronouns) ? user.pronouns : ""
  );
  const [orientation, setOrientation] = useState(user?.orientation ?? "");

  if (!user) return null;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Please choose an image under 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatarUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handlePresetPick(id: string) {
    setAvatarUrl("");
    setAvatarPreset(id);
  }

  function handleSave() {
    const finalPronouns = pronouns === "custom" ? customPronouns.trim() : pronouns;
    updateProfile({
      avatarUrl: avatarUrl || undefined,
      avatarPreset: avatarUrl ? undefined : avatarPreset,
      pronouns: finalPronouns || undefined,
      orientation: orientation || undefined,
    });
    onClose();
  }

  const previewUser = { ...user, avatarUrl, avatarPreset };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md max-h-[85vh] overflow-y-auto rounded-2xl bg-panel border border-white/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-[20px] font-semibold tracking-tight">Edit profile</h2>
          <button onClick={onClose} aria-label="Close" className="text-white/40 hover:text-white/70 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center mb-8">
          <Avatar user={previewUser} size={72} />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-[13px] text-fuchsia-400 hover:text-fuchsia-300 transition-colors mt-3"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload photo
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          {avatarUrl && (
            <button
              onClick={() => setAvatarUrl("")}
              className="text-[12px] text-white/40 hover:text-white/70 transition-colors mt-1"
            >
              Remove photo
            </button>
          )}
        </div>

        <div className="mb-8">
          <p className="text-[13px] text-white/50 mb-3">Or choose an avatar</p>
          <div className="flex flex-wrap gap-3">
            {AVATAR_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePresetPick(preset.id)}
                className={`w-10 h-10 rounded-full ${preset.classes} flex items-center justify-center text-white transition-transform ${
                  !avatarUrl && avatarPreset === preset.id
                    ? "ring-2 ring-white ring-offset-2 ring-offset-panel scale-105"
                    : ""
                }`}
              >
                {!avatarUrl && avatarPreset === preset.id && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <p className="text-[13px] text-white/50 mb-3">Pronouns</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {PRONOUN_OPTIONS.map((p) => (
              <button
                key={p}
                onClick={() => setPronouns(p)}
                className={`text-[13px] px-4 py-1.5 rounded-full transition-colors ${
                  pronouns === p ? "bg-white text-black font-medium" : "bg-white/5 text-white/50 hover:text-white/80"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPronouns("custom")}
              className={`text-[13px] px-4 py-1.5 rounded-full transition-colors ${
                pronouns === "custom" ? "bg-white text-black font-medium" : "bg-white/5 text-white/50 hover:text-white/80"
              }`}
            >
              Custom
            </button>
          </div>
          {pronouns === "custom" && (
            <input
              type="text"
              value={customPronouns}
              onChange={(e) => setCustomPronouns(e.target.value)}
              placeholder="Enter your pronouns"
              className="w-full bg-ink border border-white/10 rounded-xl px-4 py-2.5 text-[14px] text-white placeholder-white/30 focus:outline-none focus:border-fuchsia-500/50"
            />
          )}
        </div>

        <div className="mb-8">
          <p className="text-[13px] text-white/50 mb-3">Sexual orientation</p>
          <div className="flex flex-wrap gap-2">
            {ORIENTATION_OPTIONS.map((o) => (
              <button
                key={o}
                onClick={() => setOrientation(o)}
                className={`text-[13px] px-4 py-1.5 rounded-full transition-colors ${
                  orientation === o ? "bg-white text-black font-medium" : "bg-white/5 text-white/50 hover:text-white/80"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-white/20 hover:border-white/40 transition-colors text-white/80 text-[14px] font-medium px-6 py-3 rounded-full"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-fuchsia-500 hover:bg-fuchsia-400 transition-colors text-white text-[14px] font-medium px-6 py-3 rounded-full"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
