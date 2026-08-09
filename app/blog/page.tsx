"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BlogModal from "@/components/BlogModal";

const POSTS = [
  {
    title: "5 ways to actually meet people after 25",
    date: "July 2026",
    excerpt:
      "The friendship math changes after school ends. Here's how our members are rebuilding their social circles.",
    content: [
      "Somewhere around 25, the automatic friend-making machine switches off. School isn't handing you the same fifty people every day anymore, work schedules stop overlapping the way they used to, and everyone you know is suddenly busy, moved away, or both. It's not that people stop wanting friends. It's that the infrastructure for meeting them quietly disappears.",
      "Here's what's actually worked for people who've rebuilt their social circle through Connect Vibe Co.",
      "1. Pick something recurring, not one-off. A single event gets you acquaintances. A weekly climbing session or a monthly supper club gets you the repeated, low-stakes exposure that friendship actually needs.",
      "2. Say yes before you've fully decided. The evenings that turn into something almost always started with a slightly reluctant yes, not a fully enthusiastic one.",
      "3. Host something small. You don't need a following to run an event. A dinner for six people you half-know does more for your social life than being a guest at ten events other people planned.",
      "4. Follow up outside the app. If a conversation clicked, say so before the night ends. \"We should get a coffee sometime\" said in the room works better than a message three days later.",
      "5. Give any group three tries before deciding it's not for you. The first time is always a little awkward. The third time, you're just there.",
    ],
  },
  {
    title: "Inside our vetting process for hosts",
    date: "June 2026",
    excerpt:
      "Every host on Connect Vibe Co goes through a review before their first event goes live. Here's what we check.",
    content: [
      "Every host on Connect Vibe Co goes through a review before their first event ever goes live, and we get asked about it a lot, so here's the actual process.",
      "Application. Hosts tell us what they want to run, how often, and why. We're looking for people who've actually done the thing before, not just people excited about the idea of doing it.",
      "Identity verification. We confirm who someone is before they're allowed to hold a spot for anyone else's money or evening.",
      "A trial event, capped small. The first event any host runs is capped at a small group size, and we ask attendees for direct feedback afterward, not a star rating buried in an app.",
      "Ongoing review. Hosts who consistently run good events get more visibility and bigger group sizes. Hosts who don't get a conversation, and if it doesn't improve, they come off the platform.",
      "We'd rather have fewer hosts we trust than a long list of people running things we haven't checked.",
    ],
  },
  {
    title: "Why we built weekend trips, not just meetups",
    date: "May 2026",
    excerpt:
      "A two-hour meetup builds acquaintances. A weekend away builds friendships. Here's the thinking behind Trips.",
    content: [
      "A two-hour meetup is enough to have a good conversation with someone. It is rarely enough to become their friend. Friendship needs repeated exposure and it needs unstructured time, the kind where nothing is scheduled and you're just around each other.",
      "That's the entire reason Trips exist as a separate category from Events.",
      "A weekend away compresses months of casual run-ins into 48 hours. You eat breakfast together. You're bored together on a car journey. You see how someone reacts when the weather ruins the plan. None of that happens over drinks after work.",
      "We keep trip groups small on purpose, usually under twelve people, because the goal isn't to maximize how many people you meet. It's to maximize how well you get to know a few of them.",
      "Meetups are still the easiest way to test the water with something new. Trips are for when you already know you like the people and just need the time together to prove it.",
    ],
  },
];

export default function BlogPage() {
  const [selected, setSelected] = useState<(typeof POSTS)[number] | null>(null);

  return (
    <div className="min-h-screen bg-ink">
      <Nav />

      <section className="max-w-3xl mx-auto px-6 pt-10 pb-8">
        <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-white/50 mb-3">
          Blog
        </p>
        <h1 className="font-display text-[32px] sm:text-[44px] font-semibold tracking-tight leading-[1.1] mb-4">
          Notes on community, hosting, and showing up
        </h1>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-24">
        <div className="space-y-4">
          {POSTS.map((post) => (
            <button
              key={post.title}
              onClick={() => setSelected(post)}
              className="w-full text-left rounded-2xl bg-panel border border-white/10 p-6 hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-2 text-[12px] text-white/50 mb-3">
                <Calendar className="w-3.5 h-3.5" />
                {post.date}
              </div>
              <h2 className="font-display text-[19px] font-semibold tracking-tight mb-2">
                {post.title}
              </h2>
              <p className="text-white/60 text-[14px] leading-relaxed">
                {post.excerpt}
              </p>
            </button>
          ))}
        </div>

        <p className="text-white/45 text-[13px] mt-10">
          More posts coming soon. Have something to say?{" "}
          <Link href="/contact" className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors">
            Get in touch
          </Link>
          .
        </p>
      </section>

      <Footer />

      {selected && <BlogModal post={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
