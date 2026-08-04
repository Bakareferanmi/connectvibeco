"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/Nav";
import { useAuth } from "@/lib/auth-context";

type Mode = "login" | "signup";

export default function AuthPage() {
  const { login, signup } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (mode === "signup") {
      if (!name.trim() || !email.trim() || password.length < 6) {
        setError("Fill in your name, email, and a password of at least 6 characters.");
        return;
      }
      const result = signup(name.trim(), email.trim(), password);
      if (!result.success) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
    } else {
      const result = login(email.trim(), password);
      if (!result.success) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
    }

    router.push("/");
  }

  return (
    <div className="min-h-screen bg-ink">
      <Nav />

      <section className="max-w-sm mx-auto px-6 pt-16 pb-24">
        <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-white/40 mb-3">
          {mode === "login" ? "Welcome back" : "Join connect vibe"}
        </p>

        <div className="flex items-center gap-1 bg-white/5 rounded-full p-1 w-fit mb-8">
          <button
            onClick={() => switchMode("login")}
            className={`text-[13px] px-4 py-1.5 rounded-full transition-colors ${
              mode === "login" ? "bg-white text-black font-medium" : "text-white/50"
            }`}
          >
            Log in
          </button>
          <button
            onClick={() => switchMode("signup")}
            className={`text-[13px] px-4 py-1.5 rounded-full transition-colors ${
              mode === "signup" ? "bg-white text-black font-medium" : "text-white/50"
            }`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-[13px] text-white/50 mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-panel border border-white/10 rounded-xl px-4 py-3 text-[14px] text-white placeholder-white/30 focus:outline-none focus:border-fuchsia-500/50"
                placeholder="Jamie Rivers"
              />
            </div>
          )}
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
              placeholder={mode === "signup" ? "At least 6 characters" : "Your password"}
            />
          </div>

          {error && <p className="text-[13px] text-fuchsia-400">{error}</p>}

          <button
            type="submit"
            className="w-full bg-fuchsia-500 hover:bg-fuchsia-400 transition-colors text-white text-[14px] font-medium px-6 py-3 rounded-full mt-2"
          >
            {mode === "login" ? "Log in" : "Sign up"}
          </button>
        </form>
      </section>

      {mode === "signup" && (
        <p className="text-center text-[12px] text-white/20 pb-10 px-6">
          This is a demo account system. Don&apos;t use a real password.
        </p>
      )}
    </div>
  );
}
