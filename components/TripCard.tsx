"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Calendar, MapPin, Users, Heart, Flame } from "lucide-react";
import type { TripListing, Accent } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { useSaved } from "@/lib/useSaved";
import { useToast } from "@/lib/toast-context";
import AttendeeStack from "@/components/AttendeeStack";

const ACCENTS: Record<Accent, { text: string; bg: string }> = {
  magenta: { text: "text-fuchsia-400", bg: "bg-fuchsia-500" },
  teal: { text: "text-cyan-400", bg: "bg-cyan-500" },
  violet: { text: "text-violet-400", bg: "bg-violet-500" },
};

const LOW_SPOTS_THRESHOLD = 3;

export default function TripCard({ trip }: { trip: TripListing }) {
  const a = ACCENTS[trip.accent];
  const { user } = useAuth();
  const { saved, toggle } = useSaved(trip.id);
  const { showToast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const isFillingFast = trip.spots <= LOW_SPOTS_THRESHOLD;
  const coverImage = trip.images?.[0];

  function handleToggle(e: React.MouseEvent) {
    if (!user) {
      e.preventDefault();
      e.stopPropagation();
      showToast("Sign in to save this");
      router.push(`/login?reason=saving&redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    const willBeSaved = !saved;
    toggle(e);
    showToast(willBeSaved ? "Saved to your list" : "Removed from saved");
  }

  return (
    <Link
      href={`/trips/${trip.id}`}
      className="relative block rounded-2xl bg-panel border border-white/10 overflow-hidden hover:border-white/20 transition-colors group"
    >
      <button
        onClick={handleToggle}
        aria-label={saved ? "Remove from saved" : "Save trip"}
        className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${saved ? "fill-fuchsia-500 text-fuchsia-500" : "text-white/70"}`}
        />
      </button>

      {coverImage ? (
        <div className="aspect-[16/9] w-full overflow-hidden bg-white/5">
          <img
            src={coverImage}
            alt={trip.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className={`h-1.5 ${a.bg}`} />
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-display font-semibold text-white text-[20px] leading-snug mb-2 pr-8">
              {trip.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-white/50">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {trip.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {trip.dates}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {trip.spots} spots left
              </span>
              {isFillingFast && (
                <span className="flex items-center gap-1 text-[11px] font-medium text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full">
                  <Flame className="w-3 h-3" />
                  Filling fast
                </span>
              )}
            </div>
          </div>
          <span className={`text-[11px] font-mono uppercase tracking-[0.1em] ${a.text}`}>
            {trip.duration}
          </span>
        </div>

        <ul className="space-y-2 mb-6">
          {trip.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-[14px] text-white/70">
              <span className={`mt-1.5 w-1 h-1 rounded-full ${a.bg} flex-shrink-0`} />
              {h}
            </li>
          ))}
        </ul>

        <div className="mb-6">
          <AttendeeStack seed={trip.id} />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="font-mono text-white text-xl">{trip.price}</span>
          <span className="bg-white text-black text-[13px] font-medium px-5 py-2.5 rounded-full">
            Reserve your spot
          </span>
        </div>
      </div>
    </Link>
  );
}
