const TESTIMONIALS = [
  {
    quote:
      "Booked a rooftop night on a whim and left with three new friends and a running club invite.",
    name: "Dara O.",
    context: "Member since 2025",
    accent: "border-fuchsia-500/30",
  },
  {
    quote:
      "The waiver and payment flow took under a minute. Everything after that was the easy part.",
    name: "Femi A.",
    context: "Booked 6 trips",
    accent: "border-violet-500/30",
  },
  {
    quote:
      "I moved to a new city and didn't know a single person. Three weeks in, my calendar was full.",
    name: "Priya S.",
    context: "Member since 2024",
    accent: "border-cyan-500/30",
  },
];

export default function Testimonials() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 border-t border-white/10">
      <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-white/40 mb-3">
        From the community
      </p>
      <h2 className="font-display text-[32px] sm:text-[40px] font-semibold tracking-tight max-w-lg mb-12">
        People who showed up
      </h2>

      <div className="grid sm:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.name}
            className={`rounded-2xl bg-panel border ${t.accent} p-6 flex flex-col justify-between`}
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
