"use client";

import { useRef, useState } from "react";
import { X as CloseIcon, Upload, Check, Instagram, Check as CheckIcon } from "lucide-react";
import { XIcon, TikTokIcon } from "@/components/SocialIcons";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import { useModalA11y } from "@/lib/useModalA11y";
import Avatar, { AVATAR_PRESETS } from "@/components/Avatar";

const PRONOUN_OPTIONS = ["She/her", "He/him", "They/them", "Ask me"];
const INTEREST_OPTIONS = [
  "Live music",
  "Foodie",
  "Nightlife",
  "Hiking",
  "Travel",
  "Fitness",
  "Art",
  "Gaming",
  "Sports",
  "Books",
  "Fashion",
  "Tech",
];
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
const BIO_MAX_LENGTH = 160;

function cleanHandle(value: string) {
  return value.trim().replace(/^@/, "");
}

export default function ProfileModal({ onClose }: { onClose: () => void }) {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useModalA11y(onClose, true);

  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? "");
  const [avatarPreset, setAvatarPreset] = useState(user?.avatarPreset ?? "magenta");
  const [pronouns, setPronouns] = useState(
    user?.pronouns && !PRONOUN_OPTIONS.includes(user.pronouns) ? "custom" : user?.pronouns ?? ""
  );
  const [customPronouns, setCustomPronouns] = useState(
    user?.pronouns && !PRONOUN_OPTIONS.includes(user.pronouns) ? user.pronouns : ""
  );
  const [orientation, setOrientation] = useState(user?.orientation ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [age, setAge] = useState(user?.age ? String(user.age) : "");
  const [city, setCity] = useState(user?.city ?? "");
  const [interests, setInterests] = useState<string[]>(user?.interests ?? []);
  const [instagram, setInstagram] = useState(user?.instagram ?? "");
  const [twitter, setTwitter] = useState(user?.twitter ?? "");
  const [tiktok, setTiktok] = useState(user?.tiktok ?? "");
  const [justSaved, setJustSaved] = useState(false);

  function toggleInterest(interest: string) {
    setInterests((current) =>
      current.includes(interest) ? current.filter((i) => i !== interest) : [...current, interest]
    );
  }

  if (!user) return null;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast("Please choose an image under 2MB.");
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
    const parsedAge = parseInt(age, 10);
    updateProfile({
      avatarUrl: avatarUrl || undefined,
      avatarPreset: avatarUrl ? undefined : avatarPreset,
      pronouns: finalPronouns || undefined,
      orientation: orientation || undefined,
      bio: bio.trim() || undefined,
      age: Number.isFinite(parsedAge) && parsedAge > 0 ? parsedAge : undefined,
      city: city.trim() || undefined,
      interests: interests.length > 0 ? interests : undefined,
      instagram: cleanHandle(instagram) || undefined,
      twitter: cleanHandle(twitter) || undefined,
      tiktok: cleanHandle(tiktok) || undefined,
    });
    showToast("Profile updated");
    setJustSaved(true);
    setTimeout(() => {
      onClose();
    }, 700);
  }

  const previewUser = { ...user, avatarUrl, avatarPreset };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        tabIndex={-1}
        className="relative w-full max-w-md max-h-[85vh] overflow-y-auto rounded-2xl bg-panel border border-white/10 p-6 focus:outline-none"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id="profile-modal-title" className="font-display text-[20px] font-semibold tracking-tight">Edit profile</h2>
          <button onClick={onClose} aria-label="Close" className="text-white/40 hover:text-white/70 transition-colors">
            <CloseIcon className="w-5 h-5" />
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
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload profile photo"
          />
          {avatarUrl && (
            <button
              onClick={() => setAvatarUrl("")}
              className="text-[12px] text-white/40 hover:text-white/70 transition-colors mt-1"
            >
              Remove photo
            </button>
          )}
        </div>

        <div className="mb-8" role="group" aria-labelledby="avatar-preset-label">
          <p id="avatar-preset-label" className="text-[13px] text-white/50 mb-3">Or choose an avatar</p>
          <div className="flex flex-wrap gap-3">
            {AVATAR_PRESETS.map((preset) => {
              const isSelected = !avatarUrl && avatarPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handlePresetPick(preset.id)}
                  aria-pressed={isSelected}
                  aria-label={`${preset.id} avatar`}
                  className={`w-10 h-10 rounded-full ${preset.classes} flex items-center justify-center text-white transition-transform ${
                    isSelected ? "ring-2 ring-white ring-offset-2 ring-offset-panel scale-105" : ""
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <label htmlFor="bio" className="text-[13px] text-white/50">Bio</label>
            <span className="text-[11px] font-mono text-white/30">
              {bio.length}/{BIO_MAX_LENGTH}
            </span>
          </div>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, BIO_MAX_LENGTH))}
            placeholder="Tell people a bit about yourself"
            rows={3}
            className="w-full bg-ink border border-white/10 rounded-xl px-4 py-2.5 text-[14px] text-white placeholder-white/30 focus:outline-none focus:border-fuchsia-500/50 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <label htmlFor="age" className="block text-[13px] text-white/50 mb-3">Age</label>
            <input
              id="age"
              type="number"
              min={1}
              max={120}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="25"
              className="w-full bg-ink border border-white/10 rounded-xl px-4 py-2.5 text-[14px] text-white placeholder-white/30 focus:outline-none focus:border-fuchsia-500/50"
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-[13px] text-white/50 mb-3">City</label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Lagos"
              className="w-full bg-ink border border-white/10 rounded-xl px-4 py-2.5 text-[14px] text-white placeholder-white/30 focus:outline-none focus:border-fuchsia-500/50"
            />
          </div>
        </div>

        <div className="mb-8">
          <p className="text-[13px] text-white/50 mb-3">Socials</p>
          <div className="space-y-3">
            <div className="flex items-center gap-2 bg-ink border border-white/10 rounded-xl px-4 py-2.5 focus-within:border-fuchsia-500/50">
              <Instagram className="w-4 h-4 text-white/30 flex-shrink-0" aria-hidden="true" />
              <label htmlFor="instagram" className="sr-only">Instagram handle</label>
              <input
                id="instagram"
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="Instagram handle"
                className="w-full bg-transparent text-[14px] text-white placeholder-white/30 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 bg-ink border border-white/10 rounded-xl px-4 py-2.5 focus-within:border-fuchsia-500/50">
              <XIcon className="w-3.5 h-3.5 text-white/30 flex-shrink-0" aria-hidden="true" />
              <label htmlFor="twitter" className="sr-only">X handle</label>
              <input
                id="twitter"
                type="text"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="X handle"
                className="w-full bg-transparent text-[14px] text-white placeholder-white/30 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 bg-ink border border-white/10 rounded-xl px-4 py-2.5 focus-within:border-fuchsia-500/50">
              <TikTokIcon className="w-4 h-4 text-white/30 flex-shrink-0" aria-hidden="true" />
              <label htmlFor="tiktok" className="sr-only">TikTok handle</label>
              <input
                id="tiktok"
                type="text"
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
                placeholder="TikTok handle"
                className="w-full bg-transparent text-[14px] text-white placeholder-white/30 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mb-8" role="group" aria-labelledby="interests-label">
          <p id="interests-label" className="text-[13px] text-white/50 mb-3">Interests</p>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => {
              const isSelected = interests.includes(interest);
              return (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  aria-pressed={isSelected}
                  className={`text-[13px] px-4 py-1.5 rounded-full transition-colors ${
                    isSelected
                      ? "bg-white text-black font-medium"
                      : "bg-white/5 text-white/50 hover:text-white/80"
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-8" role="group" aria-labelledby="pronouns-label">
          <p id="pronouns-label" className="text-[13px] text-white/50 mb-3">Pronouns</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {PRONOUN_OPTIONS.map((p) => (
              <button
                key={p}
                onClick={() => setPronouns(p)}
                aria-pressed={pronouns === p}
                className={`text-[13px] px-4 py-1.5 rounded-full transition-colors ${
                  pronouns === p ? "bg-white text-black font-medium" : "bg-white/5 text-white/50 hover:text-white/80"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPronouns("custom")}
              aria-pressed={pronouns === "custom"}
              className={`text-[13px] px-4 py-1.5 rounded-full transition-colors ${
                pronouns === "custom" ? "bg-white text-black font-medium" : "bg-white/5 text-white/50 hover:text-white/80"
              }`}
            >
              Custom
            </button>
          </div>
          {pronouns === "custom" && (
            <>
              <label htmlFor="customPronouns" className="sr-only">Custom pronouns</label>
              <input
                id="customPronouns"
                type="text"
                value={customPronouns}
                onChange={(e) => setCustomPronouns(e.target.value)}
                placeholder="Enter your pronouns"
                className="w-full bg-ink border border-white/10 rounded-xl px-4 py-2.5 text-[14px] text-white placeholder-white/30 focus:outline-none focus:border-fuchsia-500/50"
              />
            </>
          )}
        </div>

        <div className="mb-8" role="group" aria-labelledby="orientation-label">
          <p id="orientation-label" className="text-[13px] text-white/50 mb-3">Sexual orientation</p>
          <div className="flex flex-wrap gap-2">
            {ORIENTATION_OPTIONS.map((o) => (
              <button
                key={o}
                onClick={() => setOrientation(o)}
                aria-pressed={orientation === o}
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
            disabled={justSaved}
            className="flex-1 flex items-center justify-center gap-1.5 bg-fuchsia-500 hover:bg-fuchsia-400 transition-colors text-white text-[14px] font-medium px-6 py-3 rounded-full disabled:opacity-90"
          >
            {justSaved ? (
              <>
                <CheckIcon className="w-4 h-4" />
                Saved
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
