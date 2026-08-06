"use client";

import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import type { Ticket } from "@/lib/types";

interface BookingCardProps {
  ticket: Ticket;
  href: string;
  location: string;
  image?: string;
}

function formatPurchaseTime(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return `${date} · ${time}`;
}

export default function BookingCard({ ticket, href, location, image }: BookingCardProps) {
  return (
    <div className="rounded-2xl bg-panel border border-white/10 overflow-hidden">
      <Link href={href} className="block aspect-[16/9] bg-white/5">
        {image && <img src={image} alt={ticket.title} className="w-full h-full object-cover" />}
      </Link>
      <div className="p-5">
        <Link href={href} className="block mb-3">
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

        <div className="flex items-center gap-4 rounded-xl bg-ink border border-white/10 p-4">
          <div className="bg-white rounded-lg p-1.5 flex-shrink-0">
            <QRCodeSVG value={ticket.ticketId} size={56} bgColor="#ffffff" fgColor="#0a0a0a" />
          </div>
          <div className="min-w-0">
            <p className="font-mono text-[13px] text-white truncate">{ticket.ticketId}</p>
            <p className="text-[11px] text-white/40 mt-0.5">
              {ticket.qty} {ticket.qty === 1 ? "spot" : "spots"}
            </p>
            <p className="text-[11px] text-white/30 mt-0.5">Purchased {formatPurchaseTime(ticket.purchasedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
