import Link from "next/link";

const COLUMNS = [
  {
    heading: "Explore",
    links: [
      { label: "Events", href: "/events" },
      { label: "Trips", href: "/trips" },
      { label: "Saved", href: "/saved" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms and conditions", href: "/terms" },
      { label: "Privacy policy", href: "/privacy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-6 h-6 rounded-full border-2 border-fuchsia-500"
                style={{ boxShadow: "0 0 10px rgba(217,70,239,0.5)" }}
              />
              <span className="font-display font-semibold tracking-tight">
                connect vibe
              </span>
            </div>
            <p className="text-white/40 text-[13px] leading-relaxed max-w-[220px]">
              Local meetups, weekend trips, and nights out for people who want
              to show up.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-white/40 mb-4">
                {col.heading}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-white text-[14px] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
          <p className="text-white/30 text-[13px]">
            Connect Vibe Co, all rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <button className="text-white/40 hover:text-white text-[13px] transition-colors">
              Instagram
            </button>
            <button className="text-white/40 hover:text-white text-[13px] transition-colors">
              TikTok
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
