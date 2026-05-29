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
  "AI-native studio building brands and web\nexperiences for high-growth startups",
  "Crafted from first principles —\npositioning, brand, and product in one room",
  "Pick a project to step inside,\nor scroll on to learn how we work",
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
      {/* centre dot */}
      <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black" />

      {/* cycling headline */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-9 text-center px-6 w-[44ch] max-w-[88vw]">
        <AnimatePresence mode="wait">
          <motion.p
            key={textIdx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="text-[13.5px] sm:text-[14px] leading-[1.55] tracking-[-0.005em] text-black/75 whitespace-pre-line"
          >
            {CENTRE_TEXTS[textIdx]}
          </motion.p>
        </AnimatePresence>
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

      {/* scroll cue */}
      <div className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[11px] tracking-[0.22em] text-black/40 uppercase">
        <span>Scroll</span>
        <span
          className="block w-px h-8 bg-black/15"
          style={{ animation: "pulse-soft 2.2s ease-in-out infinite" }}
        />
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
      className="absolute left-1/2 top-1/2 rounded-full overflow-hidden cursor-pointer shadow-[0_2px_18px_rgba(0,0,0,0.07)] ring-1 ring-black/5"
      aria-label={`Open ${work.title}`}
    >
      <MockThumb work={work} />
    </motion.button>
  );
}
