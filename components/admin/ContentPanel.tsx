"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/lib/toast-context";
import {
  getHero,
  saveHero,
  getFaqs,
  saveFaqs,
  newFaqItem,
  getTestimonials,
  saveTestimonials,
  newTestimonialItem,
  type HeroContent,
  type FaqItem,
  type TestimonialItem,
  type TestimonialAccent,
} from "@/lib/content";

const inputClass =
  "w-full h-10 rounded-xl bg-ink border border-white/10 px-3 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-fuchsia-500/50 transition-colors";
const textareaClass =
  "w-full rounded-xl bg-ink border border-white/10 px-3 py-2 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-fuchsia-500/50 transition-colors resize-none";
const labelClass = "block text-[12px] text-white/50 mb-1.5";

const ACCENT_OPTIONS: { value: TestimonialAccent; dot: string }[] = [
  { value: "fuchsia", dot: "bg-fuchsia-500" },
  { value: "violet", dot: "bg-violet-500" },
  { value: "cyan", dot: "bg-cyan-500" },
];

export default function ContentPanel() {
  const { showToast } = useToast();

  const [hero, setHero] = useState<HeroContent | null>(null);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);

  useEffect(() => {
    setHero(getHero());
    setFaqs(getFaqs());
    setTestimonials(getTestimonials());
  }, []);

  function handleSaveHero() {
    if (!hero) return;
    saveHero(hero);
    showToast("Hero updated");
  }

  function updateFaq(id: string, updates: Partial<FaqItem>) {
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  }

  function handleSaveFaqs() {
    saveFaqs(faqs);
    showToast("FAQ updated");
  }

  function updateTestimonial(id: string, updates: Partial<TestimonialItem>) {
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }

  function handleSaveTestimonials() {
    saveTestimonials(testimonials);
    showToast("Testimonials updated");
  }

  if (!hero) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-[17px] font-semibold tracking-tight mb-4">Homepage hero</h1>
        <div className="rounded-2xl bg-panel border border-white/10 p-4 space-y-4">
          <div>
            <label className={labelClass}>Eyebrow text</label>
            <input
              className={inputClass}
              value={hero.eyebrow}
              onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Headline</label>
              <input
                className={inputClass}
                value={hero.headlineMain}
                onChange={(e) => setHero({ ...hero, headlineMain: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Headline accent (gradient)</label>
              <input
                className={inputClass}
                value={hero.headlineAccent}
                onChange={(e) => setHero({ ...hero, headlineAccent: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Subtext</label>
            <textarea
              className={`${textareaClass} h-16`}
              value={hero.subtext}
              onChange={(e) => setHero({ ...hero, subtext: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Button label</label>
              <input
                className={inputClass}
                value={hero.ctaLabel}
                onChange={(e) => setHero({ ...hero, ctaLabel: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Button link</label>
              <input
                className={inputClass}
                value={hero.ctaHref}
                onChange={(e) => setHero({ ...hero, ctaHref: e.target.value })}
              />
            </div>
          </div>
          <button
            onClick={handleSaveHero}
            className="w-full h-10 rounded-xl bg-fuchsia-500 text-[13px] font-medium text-white hover:bg-fuchsia-400 transition-colors"
          >
            Save hero
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-[17px] font-semibold tracking-tight">FAQ</h2>
          <button
            onClick={() => setFaqs((prev) => [...prev, newFaqItem()])}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-white/5 text-[13px] font-medium text-white/70 hover:bg-white/10 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add question
          </button>
        </div>
        <div className="rounded-2xl bg-panel border border-white/10 p-4 space-y-4">
          {faqs.length === 0 && <p className="text-white/40 text-[13px] py-4 text-center">No questions yet.</p>}
          {faqs.map((f) => (
            <div key={f.id} className="rounded-xl border border-white/10 p-3 space-y-2">
              <div className="flex items-start gap-2">
                <input
                  className={inputClass}
                  value={f.question}
                  onChange={(e) => updateFaq(f.id, { question: e.target.value })}
                  placeholder="Question"
                />
                <button
                  onClick={() => setFaqs((prev) => prev.filter((x) => x.id !== f.id))}
                  aria-label="Remove question"
                  className="w-10 h-10 flex-shrink-0 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <textarea
                className={`${textareaClass} h-16`}
                value={f.answer}
                onChange={(e) => updateFaq(f.id, { answer: e.target.value })}
                placeholder="Answer"
              />
            </div>
          ))}
          <button
            onClick={handleSaveFaqs}
            className="w-full h-10 rounded-xl bg-fuchsia-500 text-[13px] font-medium text-white hover:bg-fuchsia-400 transition-colors"
          >
            Save FAQ
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-[17px] font-semibold tracking-tight">Testimonials</h2>
          <button
            onClick={() => setTestimonials((prev) => [...prev, newTestimonialItem()])}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-white/5 text-[13px] font-medium text-white/70 hover:bg-white/10 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add testimonial
          </button>
        </div>
        <div className="rounded-2xl bg-panel border border-white/10 p-4 space-y-4">
          {testimonials.length === 0 && (
            <p className="text-white/40 text-[13px] py-4 text-center">No testimonials yet.</p>
          )}
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-xl border border-white/10 p-3 space-y-2">
              <textarea
                className={`${textareaClass} h-16`}
                value={t.quote}
                onChange={(e) => updateTestimonial(t.id, { quote: e.target.value })}
                placeholder="Quote"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  className={inputClass}
                  value={t.name}
                  onChange={(e) => updateTestimonial(t.id, { name: e.target.value })}
                  placeholder="Name"
                />
                <input
                  className={inputClass}
                  value={t.context}
                  onChange={(e) => updateTestimonial(t.id, { context: e.target.value })}
                  placeholder="Context, e.g. Member since 2025"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {ACCENT_OPTIONS.map((a) => (
                    <button
                      key={a.value}
                      onClick={() => updateTestimonial(t.id, { accent: a.value })}
                      aria-label={a.value}
                      className={`w-6 h-6 rounded-full ${a.dot} ${
                        t.accent === a.value ? "ring-2 ring-white ring-offset-2 ring-offset-panel" : "opacity-40"
                      } transition-all`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setTestimonials((prev) => prev.filter((x) => x.id !== t.id))}
                  aria-label="Remove testimonial"
                  className="w-10 h-10 flex-shrink-0 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={handleSaveTestimonials}
            className="w-full h-10 rounded-xl bg-fuchsia-500 text-[13px] font-medium text-white hover:bg-fuchsia-400 transition-colors"
          >
            Save testimonials
          </button>
        </div>
      </div>
    </div>
  );
}
