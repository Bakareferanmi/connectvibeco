"use client";

import { useState } from "react";

export default function EventGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/9] bg-panel border border-white/10">
        <img src={images[active]} alt={alt} className="w-full h-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border transition-colors ${
                active === i ? "border-fuchsia-400" : "border-white/10 opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
