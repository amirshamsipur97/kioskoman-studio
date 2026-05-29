"use client";

import { motion } from "framer-motion";

// Placeholder lockup marks — replace with real partner logos when available.
const LOGOS = [
  { id: "altar", label: "Altar" },
  { id: "northwave", label: "Northwave" },
  { id: "chalk", label: "Chalk.io" },
  { id: "anvil", label: "Anvil" },
  { id: "okra", label: "Okra Labs" },
  { id: "veer", label: "Veer Capital" },
];

export function TrustedBy() {
  return (
    <section
      aria-label="Trusted by"
      className="relative w-full px-6 py-20 sm:py-24 bg-[#0a0a0a] text-[#f7f5ef]"
    >
      <div className="mx-auto max-w-[1180px]">
        <p className="text-[11px] tracking-[0.22em] uppercase text-white/45 mb-8 text-center">
          Trusted by founders shipping at
        </p>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {LOGOS.map((logo, i) => (
            <motion.li
              key={logo.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.04, ease: "easeOut" }}
              className="h-20 rounded-2xl bg-white/[0.04] ring-1 ring-white/10 grid place-items-center"
            >
              <LogoMark id={logo.id} label={logo.label} />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function LogoMark({ id, label }: { id: string; label: string }) {
  // Each placeholder mark is a tiny inline SVG paired with the label.
  return (
    <div className="flex items-center gap-2 text-white/75">
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
        {id === "altar" && (
          <path d="M4 20 L12 4 L20 20 H4 Z M9 14 H15" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round" />
        )}
        {id === "northwave" && (
          <path d="M4 18 Q9 8 12 14 T20 6" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        )}
        {id === "chalk" && (
          <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.8" fill="none" strokeDasharray="3 3" />
        )}
        {id === "anvil" && (
          <path d="M4 9 H20 V12 H17 V18 H7 V12 H4 Z" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round" />
        )}
        {id === "okra" && (
          <g stroke="currentColor" strokeWidth="1.6" fill="none">
            <path d="M6 6 L18 18" />
            <path d="M18 6 L6 18" />
            <circle cx="12" cy="12" r="3.5" />
          </g>
        )}
        {id === "veer" && (
          <path d="M5 5 L12 18 L19 5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
        )}
      </svg>
      <span className="text-[14.5px] font-medium tracking-[-0.005em]">{label}</span>
    </div>
  );
}
