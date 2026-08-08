"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Cake, Pencil, LayoutDashboard, Instagram, Sparkles } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Avatar from "@/components/Avatar";
import ProfileModal from "@/components/ProfileModal";
import MembershipCard from "@/components/MembershipCard";
import { XIcon, TikTokIcon } from "@/components/SocialIcons";
import { useAuth } from "@/lib/auth-context";
import { useMembership } from "@/lib/useMembership";

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-ink">
      <Nav />
      <section className="max-w-2xl mx-auto px-6 pt-12 pb-24 animate-pulse">
        <div className="h-4 w-32 bg-white/5 rounded mb-6" />
        <div className="rounded-2xl bg-panel border border-white/10 p-6 sm:p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex-shrink-0" />
              <div>
                <div className="h-5 w-32 bg-white/5 rounded mb-2" />
                <div className="h-3 w-40 bg-white/5 rounded" />
              </div>
            </div>
            <div className="h-8 w-16 bg-white/5 rounded-full flex-shrink-0" />
          </div>
          <div className="h-3 w-full bg-white/5 rounded mb-2" />
          <div className="h-3 w-2/3 bg-white/5 rounded mb-6" />
          <div className="flex gap-2 mb-6">
            <div className="h-7 w-24 bg-white/5 rounded-full" />
            <div className="h-7 w-24 bg-white/5 rounded-full" />
          </div>
          <div className="h-3 w-20 bg-white/5 rounded mb-3" />
          <div className="flex flex-wrap gap-2">
            <div className="h-7 w-20 bg-white/5 rounded-full" />
            <div className="h-7 w-16 bg-white/5 rounded-full" />
            <div className="h-7 w-24 bg-white/5 rounded-full" />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const { membership } = useMembership();
  const [editOpen, setEditOpen] = useState(false);

  if (loading) return <ProfileSkeleton />;

  if (!user) {
    return (
      <div className="min-h-screen bg-ink">
        <Nav />
        <section className="max-w-md mx-auto px-6 pt-24 pb-24 text-center">
          <p className="text-white/60 text-[15px] mb-5">Sign in to view your profile.</p>
          <Link
            href="/login"
            className="inline-block bg-fuchsia-500 hover:bg-fuchsia-400 transition-colors text-white text-[14px] font-medium px-6 py-3 rounded-full"
          >
            Sign in
          </Link>
        </section>
        <Footer />
      </div>
    );
  }

  const socialLinks = [
    user.instagram && { href: `https://instagram.com/${user.instagram}`, label: user.instagram, Icon: Instagram },
    user.twitter && { href: `https://x.com/${user.twitter}`, label: user.twitter, Icon: XIcon },
    user.tiktok && { href: `https://tiktok.com/@${user.tiktok}`, label: user.tiktok, Icon: TikTokIcon },
  ].filter(Boolean) as { href: string; label: string; Icon: typeof Instagram }[];

  return (
    <div className="min-h-screen bg-ink">
      <Nav />

      <section className="max-w-2xl mx-auto px-6 pt-12 pb-24">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-[13px] text-white/40 hover:text-white/70 transition-colors mb-6"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          Back to dashboard
        </Link>

        <div className="rounded-2xl bg-panel border border-white/10 p-6 sm:p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar user={user} size={64} />
              <div>
                <h1 className="font-display text-[22px] font-semibold tracking-tight">{user.name}</h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-white/50 mt-1">
                  {user.pronouns && <span>{user.pronouns}</span>}
                  {user.orientation && <span>{user.orientation}</span>}
                  {user.age && (
                    <span className="flex items-center gap-1">
                      <Cake className="w-3.5 h-3.5" />
                      {user.age}
                    </span>
                  )}
                  {user.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {user.city}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setEditOpen(true)}
              aria-label="Edit profile"
              className="flex items-center gap-1.5 text-[13px] text-white/50 hover:text-white/80 transition-colors bg-white/5 hover:bg-white/10 rounded-full px-3 py-1.5 flex-shrink-0"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          </div>

          {user.bio ? (
            <p className="text-white/70 text-[14px] leading-relaxed mb-6">{user.bio}</p>
          ) : (
            <p className="text-white/45 text-[14px] italic mb-6">No bio yet.</p>
          )}

          {socialLinks.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[13px] text-white/60 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full px-3 py-1.5"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </a>
              ))}
            </div>
          )}

          {user.interests && user.interests.length > 0 && (
            <div>
              <p className="font-mono text-white/40 text-[11px] uppercase tracking-[0.15em] mb-3">Interests</p>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest) => (
                  <span
                    key={interest}
                    className="text-[13px] px-4 py-1.5 rounded-full bg-white/5 text-white/60"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <p className="font-mono text-white/40 text-[11px] uppercase tracking-[0.15em] mb-3">Membership</p>
          {membership ? (
            <MembershipCard membership={membership} />
          ) : (
            <div className="rounded-2xl bg-panel border border-white/10 p-6 text-center">
              <Sparkles className="w-6 h-6 text-fuchsia-400 mx-auto mb-3" />
              <p className="text-white/60 text-[14px] mb-4">
                You're not a member yet — join for priority access and member pricing.
              </p>
              <Link
                href="/membership"
                className="inline-block bg-fuchsia-500 hover:bg-fuchsia-400 transition-colors text-white text-[14px] font-medium px-6 py-3 rounded-full"
              >
                View plans
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />

      {editOpen && <ProfileModal onClose={() => setEditOpen(false)} />}
    </div>
  );
}
