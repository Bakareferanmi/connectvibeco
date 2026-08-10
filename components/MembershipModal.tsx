"use client";

import { useState } from "react";
import { X, Loader2, Check, CreditCard, Lock } from "lucide-react";
import MembershipCard from "@/components/MembershipCard";
import { useModalA11y } from "@/lib/useModalA11y";
import { formatCardNumber, formatExpiry, formatCVC, isCardComplete } from "@/lib/cardInput";
import type { Membership } from "@/lib/useMembership";

interface MembershipModalProps {
  tierName: string;
  price: string;
  period: string;
  onClose: () => void;
  onConfirm: () => Membership;
}

export default function MembershipModal({ tierName, price, period, onClose, onConfirm }: MembershipModalProps) {
  const [status, setStatus] = useState<"review" | "processing" | "success">("review");
  const [membership, setMembership] = useState<Membership | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const containerRef = useModalA11y(onClose, status !== "processing");
  const cardComplete = isCardComplete(cardNumber, expiry, cvc, cardName);

  function handleConfirm() {
    if (!cardComplete) return;
    setStatus("processing");
    setTimeout(() => {
      const created = onConfirm();
      setMembership(created);
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
        aria-labelledby="membership-modal-title"
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

        {status === "success" && membership ? (
          <div className="flex flex-col items-center text-center py-1">
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center mb-4">
              <Check className="w-7 h-7 text-emerald-400" />
            </div>
            <h2 id="membership-modal-title" className="font-display text-[20px] font-semibold tracking-tight mb-1">
              You're a member
            </h2>
            <p className="text-white/60 text-[13px] mb-6">
              {tierName} plan is now active on your account.
            </p>

            <div className="w-full mb-2">
              <MembershipCard membership={membership} />
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
            <h2 id="membership-modal-title" className="font-display text-[20px] font-semibold tracking-tight mb-1 pr-6">
              Confirm membership
            </h2>
            <p className="text-white/50 text-[13px] mb-6">
              {tierName} plan, billed {period.replace("/", "per ")}
            </p>

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <span className="text-[14px] font-medium">Total today</span>
              <span className="font-mono text-white text-lg">{price}</span>
            </div>

            <div className="mb-6">
              <p className="text-[13px] text-white/50 mb-3 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4" />
                Card details
              </p>
              <div className="space-y-3">
                <div>
                  <label htmlFor="mCardNumber" className="sr-only">Card number</label>
                  <input
                    id="mCardNumber"
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
                    <label htmlFor="mExpiry" className="sr-only">Expiry</label>
                    <input
                      id="mExpiry"
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
                    <label htmlFor="mCvc" className="sr-only">CVC</label>
                    <input
                      id="mCvc"
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
                  <label htmlFor="mCardName" className="sr-only">Name on card</label>
                  <input
                    id="mCardName"
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
                `Pay ${price} & join`
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
