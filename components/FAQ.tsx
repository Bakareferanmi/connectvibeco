"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { getFaqs, DEFAULT_FAQS, type FaqItem } from "@/lib/content";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FaqItem[]>(DEFAULT_FAQS);

  useEffect(() => {
    setFaqs(getFaqs());
  }, []);

  if (faqs.length === 0) return null;

  return (
    <section className="max-w-3xl mx-auto px-6 pb-24">
      <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-white/40 mb-3">
        FAQ
      </p>
      <h2 className="font-display text-[28px] sm:text-[36px] font-semibold tracking-tight mb-8">
        Frequently asked questions
      </h2>

      <div className="rounded-2xl bg-panel border border-white/10 divide-y divide-white/10">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={faq.id}>
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
              >
                <span className="text-[14px] text-white/90 font-medium">{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-white/40 flex-shrink-0 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-4">
                  <p className="text-white/50 text-[13px] leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
