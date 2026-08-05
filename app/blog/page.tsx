import Link from "next/link";
import { Calendar } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const POSTS = [
  {
    title: "5 ways to actually meet people after 25",
    date: "July 2026",
    excerpt:
      "The friendship math changes after school ends. Here's how our members are rebuilding their social circles.",
  },
  {
    title: "Inside our vetting process for hosts",
    date: "June 2026",
    excerpt:
      "Every host on Connect Vibe Co goes through a review before their first event goes live. Here's what we check.",
  },
  {
    title: "Why we built weekend trips, not just meetups",
    date: "May 2026",
    excerpt:
      "A two-hour meetup builds acquaintances. A weekend away builds friendships. Here's the thinking behind Trips.",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-ink">
      <Nav />

      <section className="max-w-3xl mx-auto px-6 pt-10 pb-8">
        <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-white/40 mb-3">
          Blog
        </p>
        <h1 className="font-display text-[32px] sm:text-[44px] font-semibold tracking-tight leading-[1.1] mb-4">
          Notes on community, hosting, and showing up
        </h1>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-24">
        <div className="space-y-4">
          {POSTS.map((post) => (
            <div
              key={post.title}
              className="rounded-2xl bg-panel border border-white/10 p-6 hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-2 text-[12px] text-white/40 mb-3">
                <Calendar className="w-3.5 h-3.5" />
                {post.date}
              </div>
              <h2 className="font-display text-[19px] font-semibold tracking-tight mb-2">
                {post.title}
              </h2>
              <p className="text-white/60 text-[14px] leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          ))}
        </div>

        <p className="text-white/30 text-[13px] mt-10">
          More posts coming soon. Have something to say?{" "}
          <Link href="/contact" className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors">
            Get in touch
          </Link>
          .
        </p>
      </section>

      <Footer />
    </div>
  );
}
