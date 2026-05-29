"use client";

import { useState } from "react";
import { Logo } from "@/components/Logo";
import { NavPill } from "@/components/NavPill";
import { CtaPill } from "@/components/CtaPill";
import { OrbitStage } from "@/components/OrbitStage";
import { ChatPanel } from "@/components/ChatPanel";
import { SpinnerDots } from "@/components/SpinnerDots";
import { ServicesTabs } from "@/components/sections/ServicesTabs";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { SiteFooter } from "@/components/sections/SiteFooter";

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      {/* fixed chrome */}
      <div className="fixed top-6 left-6 z-50 mix-blend-difference text-white">
        <Logo />
      </div>
      <NavPill />

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
        <TrustedBy />
        <ProcessSteps />
        <FaqAccordion />
        <SiteFooter />
      </main>
    </>
  );
}
