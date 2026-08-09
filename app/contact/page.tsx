"use client";

import { useState } from "react";
import { Mail, MessageSquare } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useToast } from "@/lib/toast-context";

export default function ContactPage() {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast("Please fill in all fields");
      return;
    }
    setSent(true);
    showToast("Message sent — we'll get back to you soon");
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <div className="min-h-screen bg-ink">
      <Nav />

      <section className="max-w-2xl mx-auto px-6 pt-10 pb-24">
        <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-white/40 mb-3">
          Contact
        </p>
        <h1 className="font-display text-[32px] sm:text-[44px] font-semibold tracking-tight leading-[1.1] mb-4">
          Get in touch
        </h1>
        <p className="text-white/60 text-[15px] leading-relaxed max-w-md mb-10">
          Questions about an event, hosting your own, or just want to say hi
          — send us a message and we'll reply as soon as we can.
        </p>

        <div className="flex flex-wrap gap-4 mb-10">
          <div className="flex items-center gap-2 text-[14px] text-white/60">
            <Mail className="w-4 h-4 text-fuchsia-400" />
            hello@connectvibeco.com
          </div>
          <div className="flex items-center gap-2 text-[14px] text-white/60">
            <MessageSquare className="w-4 h-4 text-fuchsia-400" />
            Usually reply within 24 hours
          </div>
        </div>

        {sent ? (
          <div className="rounded-2xl bg-panel border border-white/10 p-8 text-center" role="status">
            <p className="font-display text-[18px] font-semibold mb-2">
              Message sent
            </p>
            <p className="text-white/60 text-[14px]">
              Thanks for reaching out — we'll get back to you soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="contact-name" className="block text-[13px] text-white/50 mb-2">Name</label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-panel border border-white/10 rounded-xl px-4 py-3 text-[14px] text-white placeholder-white/30 focus:outline-none focus:border-fuchsia-500/50"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-[13px] text-white/50 mb-2">Email</label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-panel border border-white/10 rounded-xl px-4 py-3 text-[14px] text-white placeholder-white/30 focus:outline-none focus:border-fuchsia-500/50"
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-[13px] text-white/50 mb-2">Message</label>
              <textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help?"
                rows={5}
                className="w-full bg-panel border border-white/10 rounded-xl px-4 py-3 text-[14px] text-white placeholder-white/30 focus:outline-none focus:border-fuchsia-500/50 resize-none"
              />
            </div>
            <button
              type="submit"
              className="bg-white text-black text-[14px] font-medium px-6 py-3 rounded-full hover:bg-white/90 transition-colors"
            >
              Send message
            </button>
          </form>
        )}
      </section>

      <Footer />
    </div>
  );
}
