"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type Service = {
  id: string;
  label: string;
  headline: string;
  body: string;
  bullets: string[];
};

const SERVICES: Service[] = [
  {
    id: "brand",
    label: "Brand identity",
    headline: "A brand that earns trust before the first scroll.",
    body: "We shape the wedge — what you stand for, who it's for, and the exact words to say it. Then we build the system around it so the team can ship on-brand without us in the room.",
    bullets: [
      "Positioning & narrative",
      "Mark, wordmark & flexible mark system",
      "Type stack and motion principles",
      "Guidelines the team actually uses",
    ],
  },
  {
    id: "web",
    label: "Web design & dev",
    headline: "Marketing sites built by the people who design them.",
    body: "Designer-engineer pairs ship the marketing site end to end — concept, components, copy polish, and the production deploy. No handoff black hole.",
    bullets: [
      "Information architecture grounded in buyer questions",
      "Component-driven design that scales beyond launch",
      "Editorial layouts that hold up at scroll depth",
      "Deployed on Vercel, Sanity-ready CMS",
    ],
  },
  {
    id: "product",
    label: "Product UI",
    headline: "Product surfaces that feel sharp at every density.",
    body: "From first onboarding to the deepest settings table, we design product UI that respects the work being done — and the people doing it.",
    bullets: [
      "First-run flows that convert trial to paid",
      "Dense data views and timeline interfaces",
      "Component library your engineers own",
      "Telemetry, status and audit trails — first-class",
    ],
  },
  {
    id: "motion",
    label: "Motion & video",
    headline: "Motion that reads like the product feels.",
    body: "Hero loops, product demos, and brand films cut to the rhythm of the rest of your site. We design motion as part of the system, not an afterthought.",
    bullets: [
      "Hero loops and explainer cuts",
      "Product demos shot from your real UI",
      "Brand films and launch trailers",
      "Motion guidelines for the whole team",
    ],
  },
];

export function ServicesTabs() {
  const [activeId, setActiveId] = useState(SERVICES[0].id);
  const active = SERVICES.find((s) => s.id === activeId) ?? SERVICES[0];

  return (
    <section
      id="services"
      className="relative w-full px-6 py-28 sm:py-36 bg-[#0a0a0a] text-[#f7f5ef]"
    >
      <div className="mx-auto max-w-[1180px]">
        <div className="flex items-start justify-between flex-wrap gap-6 mb-10">
          <p className="text-[11px] tracking-[0.22em] uppercase text-white/45">
            Services
          </p>
          <h2 className="text-[34px] sm:text-[44px] leading-[1.05] tracking-[-0.02em] max-w-[18ch] font-medium">
            Four practices, shipped as one team.
          </h2>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {SERVICES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveId(s.id)}
              className={
                s.id === activeId
                  ? "rounded-full bg-white text-black px-4 py-2 text-[13px] font-medium"
                  : "rounded-full bg-white/[0.06] text-white/65 hover:bg-white/[0.12] px-4 py-2 text-[13px] transition-colors"
              }
              aria-pressed={s.id === activeId}
            >
              {s.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
          >
            <div className="lg:col-span-7">
              <h3 className="text-[28px] sm:text-[34px] leading-[1.15] tracking-[-0.015em] font-medium">
                {active.headline}
              </h3>
              <p className="mt-4 text-[15.5px] leading-[1.6] text-white/65 max-w-[52ch]">
                {active.body}
              </p>
            </div>
            <ul className="lg:col-span-5 flex flex-col gap-3">
              {active.bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-3 rounded-2xl bg-white/[0.04] ring-1 ring-white/10 px-4 py-3.5"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-[14px] leading-[1.45] text-white/85">{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
