import Link from "next/link";
import { Calendar, MapPin, Users } from "lucide-react";
import type { TripListing, Accent } from "@/lib/types";

const ACCENTS: Record<Accent, { text: string; bg: string }> = {
  magenta: { text: "text-fuchsia-400", bg: "bg-fuchsia-500" },
  teal: { text: "text-cyan-400", bg: "bg-cyan-500" },
  violet: { text: "text-violet-400", bg: "bg-violet-500" },
};

export default function TripCard({ trip }: { trip: TripListing }) {
  const a = ACCENTS[trip.accent];
  return (
    <Link
      href={`/trips/${trip.id}`}
      className="block rounded-2xl bg-panel border border-white/10 overflow-hidden hover:border-white/20 transition-colors"
    >
      <div className={`h-1.5 ${a.bg}`} />
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-display font-semibold text-white text-[20px] leading-snug mb-2">
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
