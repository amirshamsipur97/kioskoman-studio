"use client";

import {
  AnimatePresence,
  motion,
  type MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { WORKS, type Work } from "@/lib/works";
import { MockThumb } from "./MockThumb";

/**
 * Hero orbit: 8 circular work tiles drifting around a centre dot.
 *
 * - Idle rotation runs continuously; the page can scroll past the hero
 *   without the orbit hijacking the wheel.
 * - The centre headline cycles between three messages on a timer.
 * - Each tile is clickable and routes to its case-study page.
 */

const CYCLE_MS = 5200;
const CENTRE_TEXTS = [
  "Brands, instantly\nlaunch-ready.",
  "Web that scales —\ndesigned to ship.",
  "Studio-quality,\nwithout the studio.",
];

export function OrbitStage() {
  const router = useRouter();

  const rotation = useMotionValue(0); // degrees
  const smooth = useSpring(rotation, { stiffness: 38, damping: 28, mass: 1.1 });

  const [textIdx, setTextIdx] = useState(0);
  const hoverRef = useRef(false);

  // continuous idle drift
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const speed = hoverRef.current ? 1.3 : 3.2; // slow down on hover
      rotation.set(rotation.get() + dt * speed);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [rotation]);

  // cycle headline on a timer
  useEffect(() => {
    const id = window.setInterval(() => {
      setTextIdx((i) => (i + 1) % CENTRE_TEXTS.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden"
      onMouseEnter={() => (hoverRef.current = true)}
      onMouseLeave={() => (hoverRef.current = false)}
    >
      {/* centre upload card */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => router.push("#contact")}
          className="pointer-events-auto w-[88px] h-[88px] rounded-[24%] bg-white ring-1 ring-black/8 shadow-[0_2px_18px_rgba(0,0,0,0.05)] grid place-items-center hover:scale-[1.04] active:scale-[0.98] transition-transform"
          aria-label="Start a project"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M21 12.5L12.5 21a4.5 4.5 0 0 1-6.4-6.4l9-9a3 3 0 0 1 4.3 4.3l-9 9a1.5 1.5 0 0 1-2.1-2.1l8-8"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span className="text-[12.5px] text-black/55">Start a project</span>
      </div>

      {/* orbiting tiles */}
      <div className="absolute inset-0">
        {WORKS.map((w) => (
          <OrbitItem
            key={w.id}
            work={w}
            smooth={smooth}
            onClick={() => router.push(`/work/${w.slug}`)}
          />
        ))}
      </div>

      {/* bottom-left display headline (cycles) */}
      <div className="pointer-events-none absolute left-6 sm:left-10 bottom-10 sm:bottom-14 max-w-[88vw]">
        <AnimatePresence mode="wait">
          <motion.h1
            key={textIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="text-[42px] sm:text-[64px] md:text-[78px] leading-[0.96] tracking-[-0.028em] font-medium whitespace-pre-line text-black"
          >
            <span className="text-black">{CENTRE_TEXTS[textIdx].split("\n")[0]}</span>
            <br />
            <span className="text-black/45">
              {CENTRE_TEXTS[textIdx].split("\n")[1] ?? ""}
            </span>
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* scroll cue */}
      <div className="pointer-events-none absolute bottom-10 right-6 sm:right-10 text-[11px] tracking-[0.24em] text-black/40 uppercase">
        Scroll down
      </div>

      {/* centre copyright */}
      <div className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 text-[11px] text-black/35">
        © {new Date().getFullYear()}
      </div>
    </section>
  );
}

/* -------------------------------- Orbit item -------------------------------- */

function OrbitItem({
  work,
  smooth,
  onClick,
}: {
  work: Work;
  smooth: MotionValue<number>;
  onClick: () => void;
}) {
  const x = useTransform(smooth, (r) => {
    const a = ((work.angle + r) * Math.PI) / 180;
    return `${Math.cos(a) * work.radius}vmin`;
  });
  const y = useTransform(smooth, (r) => {
    const a = ((work.angle + r) * Math.PI) / 180;
    return `${Math.sin(a) * work.radius}vmin`;
  });

  const sizeStyle = useMemo(() => `${work.size}vmin`, [work.size]);

  return (
    <motion.button
      onClick={onClick}
      style={{
        x,
        y,
        width: sizeStyle,
        height: sizeStyle,
        marginLeft: `calc(${sizeStyle} / -2)`,
        marginTop: `calc(${sizeStyle} / -2)`,
      }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="absolute left-1/2 top-1/2 rounded-[28%] overflow-hidden cursor-pointer shadow-[0_2px_18px_rgba(0,0,0,0.07)] ring-1 ring-black/5"
      aria-label={`Open ${work.title}`}
    >
      <MockThumb work={work} />
    </motion.button>
  );
}
