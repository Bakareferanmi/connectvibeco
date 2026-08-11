"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaInstagram, FaFacebookF, FaXTwitter, FaPinterestP, FaThreads, FaTiktok } from "react-icons/fa6";
import { getSocials, DEFAULT_SOCIALS, type SocialKey } from "@/lib/adminStore";

const ICON_MAP: Record<SocialKey, typeof FaInstagram> = {
  instagram: FaInstagram,
  x: FaXTwitter,
  tiktok: FaTiktok,
  facebook: FaFacebookF,
  pinterest: FaPinterestP,
  threads: FaThreads,
};

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
  const [socials, setSocials] = useState(DEFAULT_SOCIALS);

  useEffect(() => {
    setSocials(getSocials());
  }, []);

  const visibleSocials = socials.filter((s) => s.enabled && s.href.trim());

  return (
    <footer className="border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center mb-3">
              <img src="/CVC.png" alt="Connect Vibe Co" className="w-9 h-9" />
            </div>
            <p className="text-white/50 text-[13px] leading-relaxed max-w-[220px]">
              Local meetups, weekend trips, and nights out for people who want
              to show up.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-white/50 mb-4">
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
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
            <p className="text-white/45 text-[13px]">
              © 2026 Connect Vibe Co. All rights reserved.
            </p>
            <p className="text-white/45 text-[13px]">
              Built with ♥️ by{" "}
              <a
                href="https://beepeethebrand.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors"
              >
                BeepeeLabs
              </a>
            </p>
          </div>
          <div className="flex items-center gap-3">
            {visibleSocials.map((s) => {
              const Icon = ICON_MAP[s.key];
              return (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 text-white/60" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
