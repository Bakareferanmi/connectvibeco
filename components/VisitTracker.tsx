"use client";

import { useEffect } from "react";
import { trackVisit } from "@/lib/visits";

export default function VisitTracker() {
  useEffect(() => {
    trackVisit();
  }, []);

  return null;
}
