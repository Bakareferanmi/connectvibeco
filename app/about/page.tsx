import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ink">
      <Nav />

      <section className="max-w-3xl mx-auto px-6 pt-10 pb-24">
        <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-white/40 mb-3">
          About us
        </p>
        <h1 className="font-display text-[32px] sm:text-[44px] font-semibold tracking-tight leading-[1.1] mb-8">
          We built Connect Vibe Co because scrolling alone got old
        </h1>

        <div className="space-y-6 text-white/70 text-[15px] leading-relaxed max-w-xl">
          <p>
            Connect Vibe Co started with a simple frustration: it's easier
            than ever to talk to people online, and harder than ever to
            actually meet them. We wanted a way to turn "we should hang out
            sometime" into an actual plan on an actual calendar.
          </p>
          <p>
            So we built a place for small, real-world meetups and weekend
            trips — vetted, bookable, and built for people who want to show
            up rather than just scroll past.
          </p>
          <p>
            Every event and trip on the platform is designed to lower the
            barrier to walking into a room full of strangers. No awkward
            group chats, no flaking friends required — just show up and the
            rest takes care of itself.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mt-14">
          <div className="rounded-2xl bg-panel border border-white/10 p-6">
            <p className="font-mono text-white text-2xl mb-1">2024</p>
            <p className="text-white/50 text-[13px]">Founded</p>
          </div>
          <div className="rounded-2xl bg-panel border border-white/10 p-6">
            <p className="font-mono text-white text-2xl mb-1">Lagos</p>
            <p className="text-white/50 text-[13px]">Home base</p>
          </div>
          <div className="rounded-2xl bg-panel border border-white/10 p-6">
            <p className="font-mono text-white text-2xl mb-1">100%</p>
            <p className="text-white/50 text-[13px]">Vetted hosts</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
