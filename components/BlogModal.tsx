"use client";

import { X, Calendar } from "lucide-react";
import { useModalA11y } from "@/lib/useModalA11y";

interface BlogPost {
  title: string;
  date: string;
  excerpt: string;
  content: string[];
}

export default function BlogModal({ post, onClose }: { post: BlogPost; onClose: () => void }) {
  const containerRef = useModalA11y(onClose, true);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="blog-modal-title"
      tabIndex={-1}
      ref={containerRef}
      className="fixed inset-0 z-50 bg-ink overflow-y-auto focus:outline-none"
    >
      <div className="max-w-2xl mx-auto px-6 pt-8 pb-24">
        <button
          onClick={onClose}
          aria-label="Close"
          className="flex items-center gap-1.5 text-[13px] text-white/40 hover:text-white/70 transition-colors mb-8"
        >
          <X className="w-4 h-4" />
          Close
        </button>

        <div className="flex items-center gap-2 text-[12px] text-white/40 mb-4">
          <Calendar className="w-3.5 h-3.5" />
          {post.date}
        </div>

        <h1 id="blog-modal-title" className="font-display text-[28px] sm:text-[38px] font-semibold tracking-tight leading-[1.1] mb-8">
          {post.title}
        </h1>

        <div className="space-y-5">
          {post.content.map((paragraph, i) => (
            <p key={i} className="text-white/70 text-[15px] leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
