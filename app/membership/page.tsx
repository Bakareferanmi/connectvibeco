import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-ink">
      <Nav />

      <section className="max-w-3xl mx-auto px-6 pt-10 pb-24">
        <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-white/40 mb-3">
          Membership
        </p>
        <h1 className="font-display text-[32px] sm:text-[44px] font-semibold tracking-tight leading-[1.1] mb-8">
          One membership, every event and trip
        </h1>

        <div className="space-y-6 text-white/70 text-[15px] leading-relaxed max-w-xl">
          <p>
            Membership is coming soon. It'll unlock priority access to
            limited-spot events, member pricing on trips, and early invites
            before things go public.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
