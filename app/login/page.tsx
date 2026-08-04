"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = login(email.trim(), password);
    if (!result.success) {
      setError(result.error ?? "Something went wrong.");
      return;
    }
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-ink">
      <Nav />

      <section className="max-w-sm mx-auto px-6 pt-16 pb-24">
        <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-white/40 mb-3">
          Welcome back
        </p>
        <h1 className="font-display text-[32px] font-semibold tracking-tight mb-8">
          Log in
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] text-white/50 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-panel border border-white/10 rounded-xl px-4 py-3 text-[14px] text-white placeholder-white/30 focus:outline-none focus:border-fuchsia-500/50"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-[13px] text-white/50 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-panel border border-white/10 rounded-xl px-4 py-3 text-[14px] text-white placeholder-white/30 focus:outline-none focus:border-fuchsia-500/50"
              placeholder="Your password"
            />
          </div>

          {error && <p className="text-[13px] text-fuchsia-400">{error}</p>}

          <button
            type="submit"
            className="w-full bg-fuchsia-500 hover:bg-fuchsia-400 transition-colors text-white text-[14px] font-medium px-6 py-3 rounded-full mt-2"
          >
            Log in
          </button>
        </form>

        <p className="text-[13px] text-white/40 mt-6">
          New here?{" "}
          <Link href="/signup" className="text-fuchsia-400 hover:text-fuchsia-300">
            Create an account
          </Link>
        </p>
      </section>
    </div>
  );
}
