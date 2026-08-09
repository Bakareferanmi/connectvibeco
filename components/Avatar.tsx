import type { User } from "@/lib/auth-context";

export const AVATAR_PRESETS = [
  { id: "magenta", classes: "bg-gradient-to-br from-fuchsia-500 to-pink-500" },
  { id: "violet", classes: "bg-gradient-to-br from-violet-500 to-purple-500" },
  { id: "teal", classes: "bg-gradient-to-br from-cyan-500 to-teal-500" },
  { id: "sunset", classes: "bg-gradient-to-br from-orange-500 to-fuchsia-500" },
  { id: "ocean", classes: "bg-gradient-to-br from-blue-500 to-cyan-500" },
  { id: "forest", classes: "bg-gradient-to-br from-emerald-500 to-teal-500" },
  {
    id: "pride",
    classes:
      "bg-[linear-gradient(135deg,#e40303,#ff8c00,#ffed00,#008026,#004dff,#750787)]",
  },
  {
    id: "trans",
    classes:
      "bg-[linear-gradient(135deg,#5bcefa,#f5a9b8,#ffffff,#f5a9b8,#5bcefa)] ring-1 ring-white/15",
  },
  {
    id: "bi",
    classes:
      "bg-[linear-gradient(135deg,#d60270,#d60270,#9b4f96,#0038a8,#0038a8)]",
  },
  {
    id: "lesbian",
    classes:
      "bg-[linear-gradient(135deg,#d52d00,#ff9a56,#ffffff,#d362a4,#a30262)] ring-1 ring-white/15",
  },
  {
    id: "pan",
    classes: "bg-[linear-gradient(135deg,#ff218c,#ffd800,#21b1ff)]",
  },
  {
    id: "nonbinary",
    classes:
      "bg-[linear-gradient(135deg,#fcf434,#ffffff,#9c59d1,#2c2c2c)] ring-1 ring-white/15",
  },
] as const;

export function presetClasses(id?: string) {
  return AVATAR_PRESETS.find((p) => p.id === id)?.classes ?? "bg-fuchsia-500";
}

export default function Avatar({ user, size = 24 }: { user: User; size?: number }) {
  const dimension = `${size}px`;

  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.name}
        style={{ width: dimension, height: dimension }}
        className="rounded-full object-cover flex-shrink-0"
      />
    );
  }

  return (
    <div
      style={{ width: dimension, height: dimension }}
      className={`rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ${presetClasses(
        user.avatarPreset
      )}`}
    >
      <span style={{ fontSize: size * 0.45 }}>{user.name.charAt(0).toUpperCase()}</span>
    </div>
  );
}
