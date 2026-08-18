import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import Nav from "@/components/Nav";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-ink">
      <Nav />
      <section className="max-w-sm mx-auto px-6 pt-20 pb-24 text-center">
        <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-5">
          <Mail className="w-6 h-6 text-white/50" />
        </div>
        <h1 className="font-display text-[24px] font-semibold tracking-tight mb-3">
          Password reset isn&apos;t live yet
        </h1>
        <p className="text-white/60 text-[14px] leading-relaxed mb-8">
          We&apos;re still setting up email delivery. In the meantime, reach out to us directly and
          we&apos;ll help you get back into your account.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-[14px] text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to sign in
        </Link>
      </section>
    </div>
  );
}
