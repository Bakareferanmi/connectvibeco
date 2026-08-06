"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "How do I book a spot at an event or trip?",
    answer:
      "Open any event or trip page and tap Book spot. Pick how many spots you need, confirm payment, and you'll get a ticket with a QR code right away.",
  },
  {
    question: "Where can I find my ticket after booking?",
    answer:
      "Your ticket stays on the event or trip page you booked, and every ticket you've ever booked lives on your Bookings page, each with its own QR code and a download button.",
  },
  {
    question: "Can I cancel a booking?",
    answer:
      "Cancellations aren't self-service yet. If you need to cancel or change a booking, reach out through the Contact page and we'll sort it out.",
  },
  {
    question: "What do I get with membership?",
    answer:
      "Membership unlocks priority access to limited-spot events, discounted pricing on bookings, and free guest passes, with better perks the longer your plan. Check the Membership page for the full breakdown by tier.",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "Yes. Payments are processed securely and we never store your full card details.",
  },
  {
    question: "How do I save something for later?",
    answer:
      "Tap Save on any event or trip page. Everything you save shows up on your Saved page and on your dashboard.",
  },
] as const;

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="max-w-3xl mx-auto px-6 pb-24">
      <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-white/40 mb-3">
        FAQ
      </p>
      <h2 className="font-display text-[28px] sm:text-[36px] font-semibold tracking-tight mb-8">
        Frequently asked questions
      </h2>

      <div className="rounded-2xl bg-panel border border-white/10 divide-y divide-white/10">
        {FAQS.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={faq.question}>
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
