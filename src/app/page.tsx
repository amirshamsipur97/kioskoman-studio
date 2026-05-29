"use client";

import { useState } from "react";
import { Logo } from "@/components/Logo";
import { MenuTrigger } from "@/components/MenuTrigger";
import { MenuPanel } from "@/components/MenuPanel";
import { CtaPill } from "@/components/CtaPill";
import { OrbitStage } from "@/components/OrbitStage";
import { ChatPanel } from "@/components/ChatPanel";
import { SpinnerDots } from "@/components/SpinnerDots";
import { ServicesTabs } from "@/components/sections/ServicesTabs";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { SiteFooter } from "@/components/sections/SiteFooter";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      {/* fixed chrome — visible across every section */}
      <div className="fixed top-6 left-6 z-50 mix-blend-difference text-white">
        <Logo />
      </div>
      <MenuTrigger open={menuOpen} onToggle={() => setMenuOpen((v) => !v)} />
      <MenuPanel open={menuOpen} onClose={() => setMenuOpen(false)} />

      {!chatOpen && <CtaPill onClick={() => setChatOpen(true)} />}
      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />

      <div className="fixed bottom-7 right-7 z-30 text-black/70 mix-blend-difference" aria-hidden>
        <SpinnerDots size={22} />
      </div>

      {/* scrollable main */}
      <main className="relative">
        <OrbitStage />
        <ServicesTabs />
        <SelectedWork />
        <ProcessSteps />
        <FaqAccordion />
        <SiteFooter />
      </main>
    </>
  );
}
