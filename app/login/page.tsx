"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Nav from "@/components/Nav";
import { useAuth } from "@/lib/auth-context";

type Mode = "login" | "signup";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.6 5.6 0 0 1-2.4 3.65v3h3.86c2.26-2.09 3.56-5.17 3.56-8.89z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.84l-3.86-3c-1.07.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.11A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.35a7.2 7.2 0 0 1 0-4.7V6.54H1.29a12 12 0 0 0 0 10.92l3.98-3.11z" />
      <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.54l3.98 3.11C6.22 6.86 8.87 4.75 12 4.75z" />
    </svg>
  );
}

function AuthForm() {
  const { login, signup, loginWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const [mode, setMode] = useState<Mode>("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
    setPassword("");
    setConfirmPassword("");
  }

  function handleGoogle() {
    loginWithGoogle();
    router.push("/");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (mode === "signup") {
      if (!name.trim() || !email.trim() || password.length < 6) {
        setError("Fill in your name, email, and a password of at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords don't match.");
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

        {reason === "booking" && (
          <p className="text-[13px] text-white/60 bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-6">
            Sign in to complete your booking.
          </p>
        )}

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

        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-2.5 bg-white text-black text-[14px] font-medium px-6 py-3 rounded-full hover:bg-white/90 transition-colors mb-5"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-[12px] text-white/30 font-mono uppercase tracking-[0.1em]">or</span>
          <div className="h-px bg-white/10 flex-1" />
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-panel border border-white/10 rounded-xl px-4 py-3 pr-11 text-[14px] text-white placeholder-white/30 focus:outline-none focus:border-fuchsia-500/50"
                placeholder={mode === "signup" ? "At least 6 characters" : "Your password"}
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

          {mode === "signup" && (
            <div>
              <label className="block text-[13px] text-white/50 mb-1.5">Confirm password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-panel border border-white/10 rounded-xl px-4 py-3 pr-11 text-[14px] text-white placeholder-white/30 focus:outline-none focus:border-fuchsia-500/50"
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

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

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm />
    </Suspense>
  );
}
