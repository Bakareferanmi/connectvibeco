import { getAttendees } from "@/lib/mockAttendees";

export default function AttendeeStack({ seed }: { seed: string }) {
  const attendees = getAttendees(seed);
  const shown = attendees.slice(0, 4);
  const extra = attendees.length - shown.length;

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {shown.map((a, i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded-full ${a.presetClasses} border-2 border-panel flex items-center justify-center text-[10px] font-semibold text-white`}
          >
            {a.initial}
          </div>
        ))}
      </div>
      <span className="text-[12px] text-white/50">
        {attendees.length} going{extra > 0 ? ` · +${extra}` : ""}
      </span>
    </div>
  );
}
