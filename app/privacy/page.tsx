import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const SECTIONS = [
  {
    heading: "1. Information we collect",
    body: "We collect the information you provide when creating an account — name, email, and any profile details you choose to add, like pronouns, orientation, or a bio.",
  },
  {
    heading: "2. How we use your information",
    body: "We use your information to manage your account, process bookings, and communicate with you about events and trips you've shown interest in.",
  },
  {
    heading: "3. Information sharing",
    body: "We don't sell your personal information. We may share limited details with event and trip hosts strictly to facilitate your booking.",
  },
  {
    heading: "4. Data storage",
    body: "Your account information is stored securely. You can request deletion of your account and associated data at any time by contacting us.",
  },
  {
    heading: "5. Cookies",
    body: "We use local storage to remember your preferences, such as saved events and trips, so your experience stays consistent between visits.",
  },
  {
    heading: "6. Your rights",
    body: "You can access, update, or delete your profile information at any time from your account settings.",
  },
  {
    heading: "7. Contact us",
    body: "If you have questions about this privacy policy or how your data is handled, reach out through our contact page.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ink">
      <Nav />

      <section className="max-w-2xl mx-auto px-6 pt-10 pb-24">
        <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-white/40 mb-3">
          Legal
        </p>
        <h1 className="font-display text-[32px] sm:text-[40px] font-semibold tracking-tight leading-[1.1] mb-3">
          Privacy policy
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
