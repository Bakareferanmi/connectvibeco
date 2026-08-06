"use client";

import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import TicketReceipt from "@/components/TicketReceipt";
import type { Ticket } from "@/lib/types";

interface BookingCardProps {
  ticket: Ticket;
  href: string;
  location: string;
  image?: string;
}

export default function BookingCard({ ticket, href, location, image }: BookingCardProps) {
  return (
    <div className="rounded-2xl bg-panel border border-white/10 overflow-hidden p-5">
      <Link href={href} className="block mb-4">
        {image && (
          <div className="aspect-[16/9] bg-white/5 rounded-xl overflow-hidden mb-3">
            <img src={image} alt={ticket.title} className="w-full h-full object-cover" />
          </div>
        )}
        <h3 className="text-[15px] font-medium text-white mb-1">{ticket.title}</h3>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-white/40">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {ticket.meta}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {location}
          </span>
        </div>
      </Link>

      <TicketReceipt ticket={ticket} location={location} />
    </div>
  );
}
