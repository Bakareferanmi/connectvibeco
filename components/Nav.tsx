"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Avatar from "@/components/Avatar";
import ProfileModal from "@/components/ProfileModal";

const NAV_LINKS = [
  { label: "Events", href: "/events" },
  { label: "Trips", href: "/trips" },
] as const;

export default function Nav() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full border-2 border-fuchsia-500"
            style={{ boxShadow: "0 0 12px rgba(217,70,239,0.6)" }}
          />
          <span className="font-display font-semibold tracking-tight">
            connect vibe
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-6 text-[14px] text-white/60">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white transition-colors">
              {link.label}
            </Link>
          ))}
          <span className="text-white/30 cursor-default">Membership</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/search"
            aria-label="Search"
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <Search className="w-4 h-4 text-white/70" />
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 transition-colors rounded-full pl-1.5 pr-3 py-1.5"
              >
                <Avatar user={user} size={24} />
                <span className="text-[13px] text-white/80">{user.name.split(" ")[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-white/40" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl bg-panel border border-white/10 overflow-hidden shadow-lg z-10">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setProfileOpen(true);
                    }}
                    className="w-full text-left px-4 py-3 text-[13px] text-white/70 hover:bg-white/5 transition-colors"
                  >
                    Edit profile
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-3 text-[13px] text-white/70 hover:bg-white/5 transition-colors border-t border-white/5"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-[13px] font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-white/90 transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>

      {profileOpen && <ProfileModal onClose={() => setProfileOpen(false)} />}
    </>
  );
}
