"use client";

import { useState } from "react";
import Link from "next/link";
import { MenuTrigger } from "@/components/MenuTrigger";
import { MenuPanel } from "@/components/MenuPanel";
import { CtaPill } from "@/components/CtaPill";
import { ChatPanel } from "@/components/ChatPanel";

export function WorkChrome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="pointer-events-auto">
      <MenuTrigger open={menuOpen} onToggle={() => setMenuOpen((v) => !v)} />
      <MenuPanel open={menuOpen} onClose={() => setMenuOpen(false)} />

      <Link
        href="/"
        aria-label="Back to home"
        className="fixed left-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-black/[0.05] hover:bg-black/[0.1] text-black/70 transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden>
          <path
            d="M11 7 H3 M7 3 L3 7 L7 11"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>

      {!chatOpen && <CtaPill onClick={() => setChatOpen(true)} />}
      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
