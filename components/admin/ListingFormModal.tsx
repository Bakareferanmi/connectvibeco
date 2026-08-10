"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useModalA11y } from "@/lib/useModalA11y";
import type { Accent, EventListing, TripListing } from "@/lib/types";

const ACCENTS: Accent[] = ["magenta", "teal", "violet"];

type EventDraft = Omit<EventListing, "id">;
type TripDraft = Omit<TripListing, "id">;

interface EventFormProps {
  kind: "event";
  initial?: EventListing;
  onSave: (draft: EventDraft) => void;
  onClose: () => void;
}

interface TripFormProps {
  kind: "trip";
  initial?: TripListing;
  onSave: (draft: TripDraft) => void;
  onClose: () => void;
}

type ListingFormModalProps = EventFormProps | TripFormProps;

const inputClass =
  "w-full h-10 rounded-xl bg-ink border border-white/10 px-3 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-fuchsia-500/50 transition-colors";
const labelClass = "block text-[12px] text-white/50 mb-1.5";

export default function ListingFormModal(props: ListingFormModalProps) {
  const { kind, onClose } = props;
  const containerRef = useModalA11y(onClose, true);
  const isEvent = kind === "event";

  const [title, setTitle] = useState(props.initial?.title ?? "");
  const [location, setLocation] = useState(props.initial?.location ?? "");
  const [price, setPrice] = useState(props.initial?.price ?? "");
  const [spots, setSpots] = useState(props.initial?.spots?.toString() ?? "10");
  const [accent, setAccent] = useState<Accent>(props.initial?.accent ?? "magenta");
  const [description, setDescription] = useState(props.initial?.description ?? "");
  const [image, setImage] = useState(props.initial?.images?.[0] ?? "");

  const [category, setCategory] = useState(isEvent ? (props.initial as EventListing | undefined)?.category ?? "Social" : "");
  const [date, setDate] = useState(isEvent ? (props.initial as EventListing | undefined)?.date ?? "" : "");
  const [time, setTime] = useState(isEvent ? (props.initial as EventListing | undefined)?.time ?? "" : "");

  const [dates, setDates] = useState(!isEvent ? (props.initial as TripListing | undefined)?.dates ?? "" : "");
  const [duration, setDuration] = useState(!isEvent ? (props.initial as TripListing | undefined)?.duration ?? "" : "");
  const [highlights, setHighlights] = useState(
    !isEvent ? (props.initial as TripListing | undefined)?.highlights?.join("\n") ?? "" : ""
  );

  const canSave = title.trim() && location.trim() && price.trim() && description.trim();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    const images = image.trim() ? [image.trim()] : undefined;
    const spotsNum = Math.max(0, parseInt(spots, 10) || 0);

    if (props.kind === "event") {
      props.onSave({
        title: title.trim(),
        category: category.trim() || "Social",
        date: date.trim(),
        time: time.trim(),
        location: location.trim(),
        spots: spotsNum,
        price: price.trim(),
        accent,
        description: description.trim(),
        images,
      });
    } else {
      props.onSave({
        title: title.trim(),
        location: location.trim(),
        dates: dates.trim(),
        duration: duration.trim(),
        price: price.trim(),
        spots: spotsNum,
        highlights: highlights
          .split("\n")
          .map((h) => h.trim())
          .filter(Boolean),
        accent,
        description: description.trim(),
        images,
      });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="listing-form-title"
        tabIndex={-1}
        className="relative w-full max-w-md rounded-2xl bg-panel border border-white/10 p-6 max-h-[90vh] overflow-y-auto focus:outline-none"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 text-white/40 hover:text-white/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 id="listing-form-title" className="font-display text-[18px] font-semibold tracking-tight mb-5">
          {props.initial ? `Edit ${isEvent ? "event" : "trip"}` : `New ${isEvent ? "event" : "trip"}`}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Title</label>
            <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          {isEvent ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Category</label>
                <input className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Date</label>
                <input className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} placeholder="Sat, Aug 15" />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Time</label>
                <input className={inputClass} value={time} onChange={(e) => setTime(e.target.value)} placeholder="7:00 PM" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Dates</label>
                <input className={inputClass} value={dates} onChange={(e) => setDates(e.target.value)} placeholder="Aug 14 to Aug 16" />
              </div>
              <div>
                <label className={labelClass}>Duration</label>
                <input className={inputClass} value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="2 days" />
              </div>
            </div>
          )}

          <div>
            <label className={labelClass}>Location</label>
            <input className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Price</label>
              <input className={inputClass} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="£15" required />
            </div>
            <div>
              <label className={labelClass}>Spots</label>
              <input
                type="number"
                min={0}
                className={inputClass}
                value={spots}
                onChange={(e) => setSpots(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Accent</label>
            <div className="flex gap-2">
              {ACCENTS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAccent(a)}
                  className={`flex-1 h-9 rounded-xl border text-[12px] capitalize transition-colors ${
                    accent === a
                      ? a === "magenta"
                        ? "border-fuchsia-500 bg-fuchsia-500/15 text-fuchsia-300"
                        : a === "teal"
                        ? "border-cyan-500 bg-cyan-500/15 text-cyan-300"
                        : "border-violet-500 bg-violet-500/15 text-violet-300"
                      : "border-white/10 text-white/50 hover:bg-white/5"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {!isEvent && (
            <div>
              <label className={labelClass}>Highlights (one per line)</label>
              <textarea
                className={`${inputClass} h-24 py-2 resize-none`}
                value={highlights}
                onChange={(e) => setHighlights(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className={labelClass}>Image URL</label>
            <input className={inputClass} value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              className={`${inputClass} h-20 py-2 resize-none`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={!canSave}
            className="w-full h-11 rounded-xl bg-fuchsia-500 text-[13px] font-medium text-white hover:bg-fuchsia-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors mt-2"
          >
            {props.initial ? "Save changes" : `Create ${isEvent ? "event" : "trip"}`}
          </button>
        </form>
      </div>
    </div>
  );
}
