"use client";

import { motion } from "framer-motion";

type Step = {
  no: string;
  title: string;
  body: string;
};

const STEPS: Step[] = [
  {
    no: "01",
    title: "Discover",
    body: "Two weeks of structured listening — customer calls, audit, competitive scan. We come back with the wedge that wins.",
  },
  {
    no: "02",
    title: "Define",
    body: "We narrow on a positioning, a narrative, and the scope of work. Everyone signs the same one-pager before pixels move.",
  },
  {
    no: "03",
    title: "Design",
    body: "Concept, iteration, and review in your tools. Weekly pairs of designer and engineer hours so design ships, not stalls.",
  },
  {
    no: "04",
    title: "Deliver",
    body: "Production launch, handover docs, and a 30-day post-launch window. We stay on tap so the team doesn't ship alone.",
  },
];

export function ProcessSteps() {
  return (
    <section id="approach" className="relative w-full px-6 py-28 sm:py-36 bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex items-start justify-between flex-wrap gap-6 mb-14">
          <p className="text-[11px] tracking-[0.22em] uppercase text-white/45">
            How we work
          </p>
          <h2 className="text-[34px] sm:text-[44px] leading-[1.05] tracking-[-0.02em] max-w-[18ch] font-medium">
            Four weeks of discovery, four weeks of design, four weeks of build.
          </h2>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((s, i) => (
            <motion.li
              key={s.no}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              className="relative rounded-2xl bg-white/[0.04] ring-1 ring-white/10 p-6 sm:p-7 flex flex-col gap-3 min-h-[200px]"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] tracking-[0.18em] uppercase text-white/45">
                  {s.no}
                </span>
                <span className="text-[10px] tracking-[0.18em] uppercase text-white/35">
                  Week {(i + 1) * 2 - 1}
                </span>
              </div>
              <h3 className="text-[24px] font-medium tracking-[-0.01em]">{s.title}</h3>
              <p className="text-[13.5px] leading-[1.55] text-white/65">{s.body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
