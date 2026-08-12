"use client";

import { useEffect, useState } from "react";
import { getTestimonials, DEFAULT_TESTIMONIALS, type TestimonialItem, type TestimonialAccent } from "@/lib/content";

const ACCENT_BORDER: Record<TestimonialAccent, string> = {
  fuchsia: "border-fuchsia-500/30",
  violet: "border-violet-500/30",
  cyan: "border-cyan-500/30",
};

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(DEFAULT_TESTIMONIALS);

  useEffect(() => {
    setTestimonials(getTestimonials());
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 py-20 border-t border-white/10">
      <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-white/40 mb-3">
        From the community
      </p>
      <h2 className="font-display text-[32px] sm:text-[40px] font-semibold tracking-tight max-w-lg mb-12">
        People who showed up
      </h2>

      <div className="grid sm:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className={`rounded-2xl bg-panel border ${ACCENT_BORDER[t.accent]} p-6 flex flex-col justify-between`}
          >
            <p className="text-white/80 text-[15px] leading-relaxed mb-6">
              {t.quote}
            </p>
            <div>
              <p className="font-display font-semibold text-[14px]">{t.name}</p>
              <p className="text-white/40 text-[13px]">{t.context}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
