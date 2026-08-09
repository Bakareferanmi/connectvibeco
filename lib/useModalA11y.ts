"use client";

import { useEffect, useRef } from "react";

/**
 * Handles two accessibility requirements shared by every modal:
 * - Escape key closes it (when closing is allowed)
 * - Focus moves into the dialog on open, so keyboard/screen reader
 *   users aren't left behind on whatever triggered it
 */
export function useModalA11y(onClose: () => void, canClose: boolean = true) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!canClose) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, canClose]);

  return containerRef;
}
