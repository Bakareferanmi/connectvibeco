import Link from "next/link";
import { Compass } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ink flex flex-col">
      <Nav />

      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div
          className="w-16 h-16 rounded-full border-2 border-fuchsia-500 flex items-center justify-center mb-6"
          style={{ boxShadow: "0 0 20px rgba(217,70,239,0.5)" }}
        >
          <Compass className="w-7 h-7 text-fuchsia-400" />
        </div>

        <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-white/40 mb-3">
          404
        </p>
        <h1 className="font-display text-[32px] sm:text-[40px] font-semibold tracking-tight mb-3">
          Looks like you wandered off
        </h1>
        <p className="text-white/60 text-[15px] max-w-sm mb-8">
          This page doesn't exist, or the plan got cancelled. Let's get you back to something happening.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="bg-white text-black text-[14px] font-medium px-6 py-3 rounded-full hover:bg-white/90 transition-colors"
          >
            Back home
          </Link>
          <Link
            href="/events"
            className="border border-white/20 hover:border-white/40 transition-colors text-white/80 text-[14px] font-medium px-6 py-3 rounded-full"
          >
            Browse events
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
