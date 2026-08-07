"use client";

import { useState } from "react";
import { X, Loader2, Check, CreditCard } from "lucide-react";
import MembershipCard from "@/components/MembershipCard";
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

  function handleConfirm() {
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

      <div className="relative w-full max-w-sm rounded-2xl bg-panel border border-white/10 p-6 max-h-[90vh] overflow-y-auto">
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
            <h2 className="font-display text-[20px] font-semibold tracking-tight mb-1">
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
            <h2 className="font-display text-[20px] font-semibold tracking-tight mb-1 pr-6">
              Confirm membership
            </h2>
            <p className="text-white/50 text-[13px] mb-6">
              {tierName} plan, billed {period.replace("/", "per ")}
            </p>

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <span className="text-[14px] font-medium">Total today</span>
              <span className="font-mono text-white text-lg">{price}</span>
            </div>

            <div className="flex items-center gap-2 text-[13px] text-white/50 mb-6">
              <CreditCard className="w-4 h-4" />
              Card ending in 4242
            </div>

            <button
              onClick={handleConfirm}
              disabled={status === "processing"}
              className="w-full flex items-center justify-center gap-2 bg-white text-black text-[14px] font-medium px-6 py-3 rounded-full hover:bg-white/90 transition-colors disabled:opacity-70"
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
