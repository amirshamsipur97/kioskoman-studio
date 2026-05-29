"use client";

import { useState } from "react";
import { MenuPanel } from "./MenuPanel";
import { ScrollProgress } from "./ScrollProgress";

/**
 * Top-centre floating pill: hamburger + theme toggle (decorative) +
 * live scroll-progress chip. Pairs with MenuPanel.
 */
export function NavPill() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-[#0a0a0a] text-white pl-3 pr-1.5 py-1.5"
        role="navigation"
        aria-label="Top navigation"
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 pl-1 pr-2 py-1 text-[13px] hover:text-white/85 transition-colors"
          aria-expanded={open}
          aria-label="Open menu"
        >
          <svg width="14" height="10" viewBox="0 0 14 10" aria-hidden>
            <path d="M1 1 H13 M1 9 H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>Menu</span>
        </button>
        <span
          className="w-7 h-7 grid place-items-center rounded-full hover:bg-white/10 transition-colors text-white/70"
          aria-hidden
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.64 13a1 1 0 0 0-1.05-.14 8 8 0 1 1-8.95-9.86 1 1 0 0 0-.42-1.93A10 10 0 1 0 22 14a1 1 0 0 0-.36-1z" />
          </svg>
        </span>
        <ScrollProgress />
      </div>
      <MenuPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
}
