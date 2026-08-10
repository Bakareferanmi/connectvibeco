"use client";

import { useState } from "react";
import { X, Loader2, Check, Minus, Plus, CreditCard, Lock } from "lucide-react";
import TicketReceipt from "@/components/TicketReceipt";
import { useModalA11y } from "@/lib/useModalA11y";
import { formatCardNumber, formatExpiry, formatCVC, isCardComplete } from "@/lib/cardInput";
import type { Ticket } from "@/lib/types";

interface BookModalProps {
  title: string;
  meta: string;
  price: string;
  maxQty?: number;
  location?: string;
  image?: string;
  onClose: () => void;
  onConfirm: (qty: number) => Ticket;
}

function parsePrice(price: string) {
  const match = price.match(/^([^\d]*)(\d+(?:\.\d+)?)/);
  if (!match) return { symbol: "", amount: 0 };
  return { symbol: match[1], amount: parseFloat(match[2]) };
}

export default function BookModal({ title, meta, price, maxQty = 4, location, image, onClose, onConfirm }: BookModalProps) {
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState<"review" | "processing" | "success">("review");
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const containerRef = useModalA11y(onClose, status !== "processing");
  const { symbol, amount } = parsePrice(price);
  const fee = Math.max(1, Math.round(amount * 0.05));
  const subtotal = amount * qty;
  const total = subtotal + fee;
  const cardComplete = isCardComplete(cardNumber, expiry, cvc, cardName);

  function handleConfirm() {
    if (!cardComplete) return;
    setStatus("processing");
    setTimeout(() => {
      const created = onConfirm(qty);
      setTicket(created);
      setStatus("success");
    }, 1100);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={status === "review" ? onClose : undefined}
      />

      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-modal-title"
        tabIndex={-1}
        className="relative w-full max-w-sm rounded-2xl bg-panel border border-white/10 p-6 max-h-[90vh] overflow-y-auto focus:outline-none"
      >
        {status !== "processing" && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-5 right-5 text-white/40 hover:text-white/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {status === "success" && ticket ? (
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center mb-4">
              <Check className="w-7 h-7 text-emerald-400" />
            </div>
            <h2 id="book-modal-title" className="font-display text-[20px] font-semibold tracking-tight mb-1">You're booked</h2>
            <p className="text-white/60 text-[13px] mb-6">
              {ticket.qty} {ticket.qty === 1 ? "spot" : "spots"} for {ticket.title}
            </p>

            <div className="w-full mb-2">
              <TicketReceipt ticket={ticket} location={location} image={image} />
            </div>

            <button
              onClick={onClose}
              className="w-full bg-white text-black text-[14px] font-medium px-6 py-3 rounded-full hover:bg-white/90 transition-colors mt-3"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <h2 id="book-modal-title" className="font-display text-[20px] font-semibold tracking-tight mb-1 pr-6">Confirm booking</h2>
            <p className="text-white/50 text-[13px] mb-6">
              {title} · {meta}
            </p>

            <div className="flex items-center justify-between mb-6">
              <span className="text-[14px] text-white/70">Spots</span>
              <div className="flex items-center gap-3 bg-white/5 rounded-full px-2 py-1.5">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1 || status === "processing"}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:bg-white/10 disabled:opacity-30 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[14px] w-4 text-center">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                  disabled={qty >= maxQty || status === "processing"}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:bg-white/10 disabled:opacity-30 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-[14px] mb-4 pb-4 border-b border-white/10">
              <div className="flex items-center justify-between text-white/60">
                <span>
                  {qty} × {price}
                </span>
                <span className="font-mono">
                  {symbol}
                  {subtotal}
                </span>
              </div>
              <div className="flex items-center justify-between text-white/60">
                <span>Service fee</span>
                <span className="font-mono">
                  {symbol}
                  {fee}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-[14px] font-medium">Total</span>
              <span className="font-mono text-white text-lg">
                {symbol}
                {total}
              </span>
            </div>

            <div className="mb-6">
              <p className="text-[13px] text-white/50 mb-3 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4" />
                Card details
              </p>
              <div className="space-y-3">
                <div>
                  <label htmlFor="cardNumber" className="sr-only">Card number</label>
                  <input
                    id="cardNumber"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    disabled={status === "processing"}
                    className="w-full bg-ink border border-white/10 rounded-xl px-4 py-2.5 text-[14px] font-mono text-white placeholder-white/25 focus:outline-none focus:border-fuchsia-500/50 disabled:opacity-60"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="expiry" className="sr-only">Expiry</label>
                    <input
                      id="expiry"
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      maxLength={5}
                      disabled={status === "processing"}
                      className="w-full bg-ink border border-white/10 rounded-xl px-4 py-2.5 text-[14px] font-mono text-white placeholder-white/25 focus:outline-none focus:border-fuchsia-500/50 disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label htmlFor="cvc" className="sr-only">CVC</label>
                    <input
                      id="cvc"
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      value={cvc}
                      onChange={(e) => setCvc(formatCVC(e.target.value))}
                      placeholder="CVC"
                      maxLength={4}
                      disabled={status === "processing"}
                      className="w-full bg-ink border border-white/10 rounded-xl px-4 py-2.5 text-[14px] font-mono text-white placeholder-white/25 focus:outline-none focus:border-fuchsia-500/50 disabled:opacity-60"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="cardName" className="sr-only">Name on card</label>
                  <input
                    id="cardName"
                    type="text"
                    autoComplete="cc-name"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Name on card"
                    disabled={status === "processing"}
                    className="w-full bg-ink border border-white/10 rounded-xl px-4 py-2.5 text-[14px] text-white placeholder-white/25 focus:outline-none focus:border-fuchsia-500/50 disabled:opacity-60"
                  />
                </div>
              </div>
              <p className="flex items-center gap-1.5 text-[11px] text-white/30 mt-3">
                <Lock className="w-3 h-3" />
                This is a demo — no real charge is made.
              </p>
            </div>

            <button
              onClick={handleConfirm}
              disabled={status === "processing" || !cardComplete}
              className="w-full flex items-center justify-center gap-2 bg-white text-black text-[14px] font-medium px-6 py-3 rounded-full hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {status === "processing" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing
                </>
              ) : (
                `Pay ${symbol}${total} & book`
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
