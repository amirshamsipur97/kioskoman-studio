"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { WORKS, type Work } from "@/lib/works";
import { MockThumb } from "./MockThumb";

/**
 * Centre headline + a slowly rotating orbit of work thumbnails.
 * - Wheel / touch / arrow keys nudge the rotation.
 * - Idle, the orbit drifts at a constant slow rate (no jank).
 * - Click a thumbnail -> carousel mode with prev/next arrows.
 */
export function OrbitStage() {
  const rotation = useMotionValue(0); // degrees
  const smooth = useSpring(rotation, { stiffness: 80, damping: 22, mass: 0.6 });
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const isCarousel = selectedIdx !== null;

  // idle drift
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!isCarousel) {
        rotation.set(rotation.get() + dt * 4); // 4 deg/sec
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [rotation, isCarousel]);

  // wheel + touch
  useEffect(() => {
    if (isCarousel) return;
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      rotation.set(rotation.get() + e.deltaY * 0.35);
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const dy = e.touches[0].clientY - touchY;
      touchY = e.touches[0].clientY;
      rotation.set(rotation.get() - dy * 0.8);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [rotation, isCarousel]);

  const next = () =>
    setSelectedIdx((i) => (i === null ? 0 : (i + 1) % WORKS.length));
  const prev = () =>
    setSelectedIdx((i) =>
      i === null ? 0 : (i - 1 + WORKS.length) % WORKS.length,
    );

  // keyboard nav in carousel
  useEffect(() => {
    if (!isCarousel) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIdx(null);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isCarousel]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {isCarousel ? (
          <CarouselView
            key="carousel"
            work={WORKS[selectedIdx]}
            onClose={() => setSelectedIdx(null)}
            onPrev={prev}
            onNext={next}
          />
        ) : (
          <OrbitView
            key="orbit"
            smooth={smooth}
            onSelect={(i) => setSelectedIdx(i)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------- Orbit view -------------------------------- */

function OrbitView({
  smooth,
  onSelect,
}: {
  smooth: ReturnType<typeof useSpring>;
  onSelect: (i: number) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="relative w-full h-full"
    >
      {/* centre dot */}
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-black" />

      {/* headline beneath the dot */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-12 text-center px-6 max-w-[36ch]">
        <p className="text-[17px] sm:text-[19px] leading-[1.5] tracking-[-0.005em]">
          AI-native studio building brands and web
          <br className="hidden sm:block" /> experiences for high-growth startups
        </p>
      </div>

      {/* orbiting thumbs */}
      {WORKS.map((w, i) => (
        <OrbitItem
          key={w.id}
          work={w}
          smooth={smooth}
          onClick={() => onSelect(i)}
        />
      ))}
    </motion.div>
  );
}

function OrbitItem({
  work,
  smooth,
  onClick,
}: {
  work: Work;
  smooth: ReturnType<typeof useSpring>;
  onClick: () => void;
}) {
  // position around the centre: centre + r * (cos(a + rotation), sin(a + rotation))
  // motion's `x` / `y` style props need string output for unit-aware values.
  const x = useTransform(smooth, (r) => {
    const a = ((work.angle + r) * Math.PI) / 180;
    return `${Math.cos(a) * work.radius}vmin`;
  });
  const y = useTransform(smooth, (r) => {
    const a = ((work.angle + r) * Math.PI) / 180;
    return `${Math.sin(a) * work.radius}vmin`;
  });

  const sizeStyle = `${work.size}vmin`;

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
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="absolute left-1/2 top-1/2 rounded-full overflow-hidden cursor-pointer shadow-[0_2px_18px_rgba(0,0,0,0.07)] ring-1 ring-black/5"
      aria-label={`Open ${work.title}`}
    >
      <MockThumb work={work} />
    </motion.button>
  );
}

/* ------------------------------- Carousel view ----------------------------- */

function CarouselView({
  work,
  onClose,
  onPrev,
  onNext,
}: {
  work: Work;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="relative w-full h-full flex items-center justify-center"
    >
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous project"
        className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-zinc-800 transition-colors"
      >
        <Arrow direction="left" />
      </button>

      <motion.figure
        key={work.id}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
        className="flex flex-col items-center gap-6"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Back to overview"
          className="relative rounded-full overflow-hidden ring-1 ring-black/10 shadow-[0_8px_60px_rgba(0,0,0,0.08)]"
          style={{ width: "min(60vmin, 560px)", height: "min(60vmin, 560px)" }}
        >
          <MockThumb work={work} />
        </button>
        <figcaption className="text-center">
          <div className="text-2xl font-semibold tracking-tight">{work.title}</div>
          <div className="text-sm text-black/55 mt-1">{work.tag}</div>
        </figcaption>
      </motion.figure>

      <button
        type="button"
        onClick={onNext}
        aria-label="Next project"
        className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-zinc-800 transition-colors"
      >
        <Arrow direction="right" />
      </button>
    </motion.div>
  );
}

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      style={{ transform: direction === "left" ? "rotate(180deg)" : "none" }}
      aria-hidden
    >
      <path d="M3 7 H11 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
