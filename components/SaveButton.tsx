"use client";

import { Heart } from "lucide-react";
import { useSaved } from "@/lib/useSaved";
import { useToast } from "@/lib/toast-context";

export default function SaveButton({ id, label = "Save" }: { id: string; label?: string }) {
  const { saved, toggle } = useSaved(id);
  const { showToast } = useToast();

  function handleClick(e: React.MouseEvent) {
    const willBeSaved = !saved;
    toggle(e);
    showToast(willBeSaved ? "Saved to your list" : "Removed from saved");
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 border border-white/20 hover:border-white/40 transition-colors text-white/80 text-[14px] font-medium px-5 py-3 rounded-full"
    >
      <Heart className={`w-4 h-4 transition-colors ${saved ? "fill-fuchsia-500 text-fuchsia-500" : ""}`} />
      {saved ? "Saved" : label}
    </button>
  );
}
