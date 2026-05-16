"use client";

import { useState } from "react";
import { Logo } from "@/components/Logo";
import { MenuTrigger } from "@/components/MenuTrigger";
import { MenuPanel } from "@/components/MenuPanel";
import { CtaPill } from "@/components/CtaPill";
import { OrbitStage } from "@/components/OrbitStage";
import { ContactModal } from "@/components/ContactModal";
import { SpinnerDots } from "@/components/SpinnerDots";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <main className="fixed inset-0 overflow-hidden">
      <div className="absolute top-6 left-6 z-50">
        <Logo />
      </div>

      <MenuTrigger open={menuOpen} onToggle={() => setMenuOpen((v) => !v)} />
      <MenuPanel open={menuOpen} onClose={() => setMenuOpen(false)} />

      <OrbitStage />

      <CtaPill onClick={() => setContactOpen(true)} />

      <div className="fixed bottom-7 right-7 z-30 text-black/70" aria-hidden>
        <SpinnerDots size={22} />
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </main>
  );
}
