"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock } from "lucide-react";
import { checkAdminCredentials, setAdminAuthed } from "@/lib/adminAuth";

export default function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Enter both email and password.");
      return;
    }

    if (!checkAdminCredentials(email, password)) {
      setError("Incorrect email or password.");
      return;
    }

    setAdminAuthed();
    onSuccess();
  }

  return (
    <div className="min-h-screen bg-ink text-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <div className="w-9 h-9 rounded-full bg-fuchsia-500/15 flex items-center justify-center">
            <Lock className="w-4 h-4 text-fuchsia-400" />
          </div>
        </div>

        <h1 className="font-display text-[22px] font-semibold tracking-tight text-center mb-1.5">
          Admin sign in
        </h1>
        <p className="text-white/45 text-[13px] text-center mb-8">
          ConnectVibeCo admin panel
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="block text-[12px] text-white/50 mb-1.5">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 rounded-xl bg-panel border border-white/10 px-3.5 text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:border-fuchsia-500/50 transition-colors"
              placeholder="admin@connectvibeco.com"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-[12px] text-white/50 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 rounded-xl bg-panel border border-white/10 px-3.5 pr-11 text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:border-fuchsia-500/50 transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="text-rose-400 text-[13px]">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-fuchsia-500 hover:bg-fuchsia-400 transition-colors text-white text-[14px] font-medium"
          >
            Sign in
          </button>
        </form>

        <p className="text-white/30 text-[11px] text-center mt-6 leading-relaxed">
          Mock credentials for now — this will move to real auth once the backend is wired up.
        </p>

        <Link
          href="/"
          className="block text-center text-[13px] text-white/40 hover:text-white/60 transition-colors mt-6"
        >
          Back to site
        </Link>
      </div>
    </div>
  );
}
