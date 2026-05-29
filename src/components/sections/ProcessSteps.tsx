"use client";

import { motion } from "framer-motion";

type Step = {
  no: string;
  code: string;
  title: string;
  body: string;
  bullets: [string, string];
  bg: string;
  ink: string;
  muted: string;
  pillBg: string;
  pillInk: string;
  preview: "tiles" | "swatches" | "timeline" | "ship";
};

const STEPS: Step[] = [
  {
    no: "01",
    code: "(DC)",
    title: "Discover the wedge.",
    body: "Two weeks of structured listening — customer calls, market scan, and a sharp competitive read. We come back with the wedge that actually wins.",
    bullets: ["Customer & competitor calls", "Positioning one-pager"],
    bg: "#f1ece1",
    ink: "#0a0a0a",
    muted: "rgba(10,10,10,0.55)",
    pillBg: "#0a0a0a",
    pillInk: "#ffffff",
    preview: "tiles",
  },
  {
    no: "02",
    code: "(DF)",
    title: "Define the scope.",
    body: "We narrow on a narrative, a scope, and a calendar. Everyone signs the same one-pager before a single pixel moves.",
    bullets: ["Brand & site narrative", "Sprint plan & calendar"],
    bg: "#cdd9c5",
    ink: "#0a0a0a",
    muted: "rgba(10,10,10,0.55)",
    pillBg: "#0a0a0a",
    pillInk: "#ffffff",
    preview: "swatches",
  },
  {
    no: "03",
    code: "(DS)",
    title: "Design in your tools.",
    body: "Concept, iteration and review happen in Figma, GitHub, and Linear — wherever your team already lives. Pairs of designer + engineer ship weekly.",
    bullets: ["Designer-engineer pairs", "Weekly ship demos"],
    bg: "#0a0a0a",
    ink: "#fafaf7",
    muted: "rgba(250,250,247,0.55)",
    pillBg: "#fafaf7",
    pillInk: "#0a0a0a",
    preview: "timeline",
  },
  {
    no: "04",
    code: "(DL)",
    title: "Deliver and stay on tap.",
    body: "Production launch, handover docs, and a 30-day post-launch window. We stay on tap so the team never ships alone.",
    bullets: ["Production deploy", "30-day post-launch retainer"],
    bg: "#efe6d5",
    ink: "#0a0a0a",
    muted: "rgba(10,10,10,0.55)",
    pillBg: "#0a0a0a",
    pillInk: "#ffffff",
    preview: "ship",
  },
];

export function ProcessSteps() {
  return (
    <section id="approach" aria-label="How we work">
      <div className="px-6 pt-28 pb-6 sm:pt-36 bg-white">
        <div className="mx-auto max-w-[1180px] flex items-end justify-between flex-wrap gap-6">
          <h2 className="text-[44px] sm:text-[64px] leading-[0.98] tracking-[-0.025em] max-w-[20ch] font-medium">
            From kickoff to live in
            <br className="hidden sm:block" /> four crisp steps.
          </h2>
          <p className="text-[13.5px] text-black/55 max-w-[28ch] text-right">
            Sign on for a fixed-scope project, or stay on retainer.
            Either way, the process below is the same.
          </p>
        </div>
      </div>

      {STEPS.map((step, i) => (
        <StepPanel key={step.no} step={step} index={i} />
      ))}
    </section>
  );
}

function StepPanel({ step, index }: { step: Step; index: number }) {
  return (
    <section
      style={{ background: step.bg, color: step.ink }}
      className="relative px-6 py-20 sm:py-28 overflow-hidden"
    >
      <div className="mx-auto max-w-[1180px]">
        <div className="flex justify-center text-[12px] tracking-[0.22em] uppercase mb-12 opacity-65">
          {step.code}
        </div>

        <div className="flex items-start justify-between gap-8 flex-wrap">
          <h3 className="text-[44px] sm:text-[64px] leading-[0.98] tracking-[-0.025em] font-medium max-w-[14ch]">
            {step.title}
          </h3>
          <span
            className="text-[88px] sm:text-[128px] font-medium leading-none tracking-[-0.04em]"
            style={{ color: step.ink, opacity: 0.92 }}
          >
            {step.no}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mt-12 border-t" style={{ borderColor: step.muted + "" }}>
          {step.bullets.map((b) => (
            <div key={b} className="flex items-center gap-2.5 pt-4 text-[13.5px] opacity-80">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: step.ink }} />
              <span>{b}</span>
            </div>
          ))}
        </div>

        <p
          className="mt-8 text-[17px] sm:text-[19px] leading-[1.45] max-w-[44ch]"
          style={{ color: step.muted }}
        >
          {step.body}
        </p>

        <div className="mt-10 flex justify-center">
          <a
            href="#contact"
            className="rounded-full px-5 py-2.5 text-[13.5px] font-medium hover:opacity-85 transition-opacity"
            style={{ background: step.pillBg, color: step.pillInk }}
          >
            Start a project →
          </a>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.05 * index, ease: "easeOut" }}
          className="mt-14 sm:mt-16"
        >
          <StepPreview kind={step.preview} ink={step.ink} muted={step.muted} />
        </motion.div>
      </div>
    </section>
  );
}

function StepPreview({
  kind,
  ink,
  muted,
}: {
  kind: Step["preview"];
  ink: string;
  muted: string;
}) {
  if (kind === "tiles") {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 max-w-[820px] mx-auto">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-[26%]"
            style={{ background: muted, opacity: 0.5 + (i % 3) * 0.18 }}
          />
        ))}
      </div>
    );
  }
  if (kind === "swatches") {
    const swatches = ["#0a0a0a", "#fafaf7", "#cfe0c4", "#efe7da", "#1e2a23"];
    return (
      <div className="grid grid-cols-5 gap-3 max-w-[720px] mx-auto">
        {swatches.map((c) => (
          <div
            key={c}
            className="aspect-square rounded-[26%] ring-1 ring-black/15 flex items-end p-3"
            style={{ background: c, color: "#fff" }}
          >
            <span className="text-[10px] uppercase tracking-[0.2em] opacity-70">{c.toUpperCase()}</span>
          </div>
        ))}
      </div>
    );
  }
  if (kind === "timeline") {
    const rows = [
      { l: "Wireframes signed", w: 92 },
      { l: "Component system v1", w: 78 },
      { l: "Marketing site build", w: 64 },
      { l: "QA & polish", w: 36 },
    ];
    return (
      <div className="max-w-[820px] mx-auto rounded-2xl bg-white/[0.04] ring-1 ring-white/10 p-5 sm:p-6">
        {rows.map((r) => (
          <div key={r.l} className="grid grid-cols-12 items-center gap-3 py-2.5">
            <span className="col-span-4 text-[12.5px] opacity-75">{r.l}</span>
            <div className="col-span-8 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-white/70"
                style={{ width: `${r.w}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
  // ship
  return (
    <div className="max-w-[820px] mx-auto rounded-2xl bg-white/[0.06] ring-1 p-5" style={{ borderColor: muted }}>
      <div className="flex items-center justify-between text-[12px] opacity-65">
        <span className="uppercase tracking-[0.2em]">Deploy</span>
        <span style={{ color: ink }}>● live</span>
      </div>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
        {["Marketing site", "Component library", "CMS"].map((t) => (
          <div
            key={t}
            className="rounded-xl px-4 py-3 ring-1 flex items-center justify-between text-[13px]"
            style={{ borderColor: muted, color: ink }}
          >
            <span>{t}</span>
            <span style={{ color: muted }}>↗</span>
          </div>
        ))}
      </div>
    </div>
  );
}
