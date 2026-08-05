import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const SECTIONS = [
  {
    heading: "1. Acceptance of terms",
    body: "By creating an account or booking an event or trip through Connect Vibe Co, you agree to these terms. If you don't agree, please don't use the platform.",
  },
  {
    heading: "2. Bookings and payments",
    body: "Spots for events and trips are limited and allocated on a first-come basis at the time of booking. Prices shown are per person unless otherwise stated.",
  },
  {
    heading: "3. Cancellations",
    body: "Cancellation terms vary by event and trip and are shown at the time of booking. Some listings may be non-refundable closer to the date.",
  },
  {
    heading: "4. Member conduct",
    body: "Members are expected to treat hosts and other attendees with respect. Harassment, discrimination, or unsafe behavior at any event or trip may result in account suspension.",
  },
  {
    heading: "5. Host responsibilities",
    body: "Hosts are responsible for accurately describing their events and trips and delivering what's listed. Connect Vibe Co reserves the right to remove listings that don't meet our standards.",
  },
  {
    heading: "6. Limitation of liability",
    body: "Connect Vibe Co facilitates bookings between members and hosts but is not responsible for the conduct of third parties at events or trips.",
  },
  {
    heading: "7. Changes to these terms",
    body: "We may update these terms from time to time. Continued use of the platform after changes means you accept the updated terms.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-ink">
      <Nav />

      <section className="max-w-2xl mx-auto px-6 pt-10 pb-24">
        <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-white/40 mb-3">
          Legal
        </p>
        <h1 className="font-display text-[32px] sm:text-[40px] font-semibold tracking-tight leading-[1.1] mb-3">
          Terms and conditions
        </h1>
        <p className="text-white/40 text-[13px] mb-10">Last updated August 2026</p>

        <div className="space-y-8">
          {SECTIONS.map((s) => (
            <div key={s.heading}>
              <h2 className="font-display text-[16px] font-semibold tracking-tight mb-2">
                {s.heading}
              </h2>
              <p className="text-white/60 text-[14px] leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
