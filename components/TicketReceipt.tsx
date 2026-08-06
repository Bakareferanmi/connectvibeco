"use client";

import { useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import type { Ticket } from "@/lib/types";

interface TicketReceiptProps {
  ticket: Ticket;
  location?: string;
  image?: string;
}

function formatPurchaseTime(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return `${date} · ${time}`;
}

export default function TicketReceipt({ ticket, location, image }: TicketReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    if (!receiptRef.current) return;
    setDownloading(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(receiptRef.current, {
        backgroundColor: "#0a0a0a",
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `${ticket.ticketId}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // Download silently fails; button state resets below.
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div>
      <div ref={receiptRef} className="rounded-2xl bg-ink border border-white/10 overflow-hidden">
        {image && (
          <div className="aspect-[16/9] bg-white/5">
            <img src={image} alt={ticket.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-medium text-white pr-3">{ticket.title}</h3>
            <span className="flex-shrink-0 text-[10px] font-mono uppercase tracking-[0.15em] text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full">
              Paid
            </span>
          </div>

          <div className="flex justify-center bg-white rounded-xl p-3 mb-4 w-fit mx-auto">
            <QRCodeSVG value={ticket.ticketId} size={128} bgColor="#ffffff" fgColor="#0a0a0a" />
          </div>

          <div className="space-y-2 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-white/40 font-mono uppercase tracking-[0.1em]">Ticket ID</span>
              <span className="font-mono text-[14px] text-white">{ticket.ticketId}</span>
            </div>
            {location && (
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-white/40 font-mono uppercase tracking-[0.1em]">Location</span>
                <span className="text-[13px] text-white/70">{location}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-white/40 font-mono uppercase tracking-[0.1em]">Date</span>
              <span className="text-[13px] text-white/70">{ticket.meta}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-white/40 font-mono uppercase tracking-[0.1em]">Spots</span>
              <span className="text-[13px] text-white/70">{ticket.qty}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-white/40 font-mono uppercase tracking-[0.1em]">Price</span>
              <span className="text-[13px] text-white/70">{ticket.price}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-white/40 font-mono uppercase tracking-[0.1em]">Purchased</span>
              <span className="text-[13px] text-white/70">{formatPurchaseTime(ticket.purchasedAt)}</span>
            </div>
          </div>

          <p className="text-center text-[10px] text-white/35 font-mono uppercase tracking-[0.15em] mt-4">
            connect vibe co · proof of payment
          </p>
        </div>
      </div>

      <button
        onClick={handleDownload}
        disabled={downloading}
        className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 transition-colors text-white/80 text-[13px] font-medium px-4 py-2.5 rounded-full mt-3 disabled:opacity-60"
      >
        {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
        {downloading ? "Preparing image" : "Download ticket"}
      </button>
    </div>
  );
}
