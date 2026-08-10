"use client";

import { useModalA11y } from "@/lib/useModalA11y";

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const containerRef = useModalA11y(onCancel, true);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div
        ref={containerRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        tabIndex={-1}
        className="relative w-full max-w-xs rounded-2xl bg-panel border border-white/10 p-6 focus:outline-none"
      >
        <h2 id="confirm-dialog-title" className="font-display text-[16px] font-semibold tracking-tight mb-1.5">
          {title}
        </h2>
        <p className="text-white/60 text-[13px] mb-5">{description}</p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 h-10 rounded-xl border border-white/10 text-[13px] font-medium text-white/70 hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-10 rounded-xl bg-rose-500 text-[13px] font-medium text-white hover:bg-rose-400 transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
