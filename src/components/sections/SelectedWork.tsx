"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { WORKS } from "@/lib/works";
import { MockThumb } from "@/components/MockThumb";

/**
 * A flat grid of every work tile. Inspired by a "selected work" gallery —
 * just clickable cards, no scroll-jacking.
 */
export function SelectedWork() {
  return (
    <section id="work" className="relative w-full px-6 py-28 sm:py-36 bg-white">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex items-start justify-between flex-wrap gap-6 mb-12">
          <p className="text-[11px] tracking-[0.22em] uppercase text-black/45">
            Selected work
          </p>
          <h2 className="text-[34px] sm:text-[44px] leading-[1.05] tracking-[-0.02em] max-w-[20ch] font-medium">
            Brands and product surfaces shipped in the last 18 months.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WORKS.map((w, i) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.05, ease: "easeOut" }}
            >
              <Link
                href={`/work/${w.slug}`}
                className="group block rounded-2xl bg-[#fafaf7] ring-1 ring-black/8 overflow-hidden"
              >
                <div className="relative aspect-[4/3]">
                  <MockThumb work={w} />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </div>
                <div className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <div className="text-[15.5px] font-medium tracking-tight">{w.title}</div>
                    <div className="text-[12.5px] text-black/55 mt-0.5">{w.tag}</div>
                  </div>
                  <span className="text-black/35 group-hover:text-black/85 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                      <path
                        d="M3 7 H11 M7 3 L11 7 L7 11"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
