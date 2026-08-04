import { AVATAR_PRESETS } from "@/components/Avatar";

const NAMES = ["Ada", "Femi", "Zara", "Leo", "Nia", "Kai", "Tomi", "Sade", "Chidi", "Amara", "Yusuf", "Ronke"];

export interface MockAttendee {
  initial: string;
  presetClasses: string;
}

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getAttendees(seed: string, min = 3, max = 9): MockAttendee[] {
  const hash = hashSeed(seed);
  const count = min + (hash % (max - min + 1));
  const attendees: MockAttendee[] = [];
  for (let i = 0; i < count; i++) {
    const nameIndex = (hash + i * 7) % NAMES.length;
    const presetIndex = (hash + i * 13) % AVATAR_PRESETS.length;
    attendees.push({
      initial: NAMES[nameIndex].charAt(0),
      presetClasses: AVATAR_PRESETS[presetIndex].classes,
    });
  }
  return attendees;
}
