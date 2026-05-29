"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type Qa = {
  q: string;
  a: string;
};

const QA: Qa[] = [
  {
    q: "How fast can you start?",
    a: "Most engagements kick off two to three weeks after the first call. If something urgent lands, we can usually clear a slot inside a week.",
  },
  {
    q: "How is pricing structured?",
    a: "Fixed-scope projects for brand and web work; monthly retainers for ongoing product design. We share the full estimate before signing anything.",
  },
  {
    q: "How big is the team I'll work with?",
    a: "A senior pair for most projects — one designer-engineer and one principal as the strategic partner. We scale up only when scope demands it.",
  },
  {
    q: "Which tools do you ship in?",
    a: "Figma for design, Next.js or Astro for marketing sites, your existing stack for product work. We meet your team where it already is.",
  },
  {
    q: "Do you handle the deploy and the CMS?",
    a: "Yes — we ship the production deploy on Vercel and wire a CMS the team can run without us. Documentation handover is included.",
  },
  {
    q: "What if we don't have a designer in-house?",
    a: "We can stay on as a fractional design partner after launch. Most clients keep us on a light retainer for the first six months.",
  },
];

export function FaqAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="relative w-full px-6 py-28 sm:py-36 bg-[#0a0a0a] text-[#f7f5ef]">
      <div className="mx-auto max-w-[920px]">
        <div className="flex items-start justify-between flex-wrap gap-6 mb-12">
          <p className="text-[11px] tracking-[0.22em] uppercase text-white/45">
            FAQ
          </p>
          <h2 className="text-[34px] sm:text-[44px] leading-[1.05] tracking-[-0.02em] max-w-[18ch] font-medium">
            The questions every founder asks before signing.
          </h2>
        </div>

        <ul className="flex flex-col">
          {QA.map((item, i) => {
            const open = i === openIdx;
            return (
              <li
                key={item.q}
                className="border-t border-white/10 last:border-b last:border-white/10"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(open ? null : i)}
                  className="w-full flex items-center justify-between gap-6 py-5 text-left"
                  aria-expanded={open}
                >
                  <span className="text-[16px] sm:text-[17px] font-medium tracking-tight">
                    {item.q}
                  </span>
                  <span
                    className={
                      "shrink-0 w-7 h-7 rounded-full grid place-items-center transition-colors " +
                      (open ? "bg-white text-black" : "bg-white/[0.08] text-white/65")
                    }
                  >
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 11 11"
                      aria-hidden
                      style={{
                        transform: open ? "rotate(45deg)" : "rotate(0deg)",
                        transition: "transform 0.25s",
                      }}
                    >
                      <path
                        d="M5.5 1 V10 M1 5.5 H10"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 pr-12 text-[14.5px] leading-[1.6] text-white/65">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
