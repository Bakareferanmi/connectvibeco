const STEPS = [
  {
    n: "01",
    title: "Browse what's on",
    body: "Filter meetups and trips by date, category, or how far you're willing to travel.",
    accent: "text-fuchsia-400",
  },
  {
    n: "02",
    title: "Book your spot",
    body: "Pay securely, sign the waiver, and get a confirmation with everything you need to know.",
    accent: "text-violet-400",
  },
  {
    n: "03",
    title: "Show up and meet people",
    body: "Turn up, scan your ticket, and spend the evening with people who showed up for the same reason you did.",
    accent: "text-cyan-400",
  },
];

export default function HowItWorks() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 border-t border-white/10">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-white/40 mb-3">
            How it works
          </p>
          <h2 className="font-display text-[32px] sm:text-[40px] font-semibold tracking-tight max-w-lg">
            Three steps between you and your next plan
          </h2>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-8">
        {STEPS.map((step) => (
          <div key={step.n} className="relative pl-1">
            <span className={`font-mono text-[13px] ${step.accent}`}>{step.n}</span>
            <h3 className="font-display text-[18px] font-semibold mt-3 mb-2">
              {step.title}
            </h3>
            <p className="text-white/50 text-[14px] leading-relaxed">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
