"use client";

import TicketReceipt from "@/components/TicketReceipt";
import { useBooking } from "@/lib/useBooking";

interface TicketStatusProps {
  id: string;
  location: string;
  image?: string;
}

export default function TicketStatus({ id, location, image }: TicketStatusProps) {
  const { ticket } = useBooking(id);

  if (!ticket) return null;

  return (
    <div className="mt-6">
      <p className="font-mono text-white/40 text-[11px] uppercase tracking-[0.15em] mb-3">Your ticket</p>
      <TicketReceipt ticket={ticket} location={location} image={image} />
    </div>
  );
}
