"use client";

import { useEffect, useState } from "react";

/**
 * Reads window.scrollY against the document height and prints the
 * percentage. Lives inside the floating nav pill.
 */
export function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.round((window.scrollY / max) * 100) : 0;
      setPct(Math.min(100, Math.max(0, p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <span
      className="inline-flex items-center justify-center rounded-full bg-white/15 text-white px-2.5 py-1 text-[11.5px] tabular-nums leading-none"
      aria-label={`Scrolled ${pct}%`}
    >
      {pct}%
    </span>
  );
}
