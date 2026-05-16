"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { WORKS, type Work } from "@/lib/works";
import { MockThumb } from "./MockThumb";

/**
 * Centre headline + a slowly rotating orbit of work thumbnails.
 * - Wheel / touch / arrow keys nudge the rotation.
 * - Idle, the orbit drifts at a constant slow rate (no jank).
 * - Click a thumbnail -> carousel mode (peek neighbours above/below).
 * - Click the centre image in carousel mode -> navigate to /work/[slug].
 */
export function OrbitStage() {
  const router = useRouter();
  const rotation = useMotionValue(0); // degrees
  const smooth = useSpring(rotation, { stiffness: 80, damping: 22, mass: 0.6 });
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const isCarousel = selectedIdx !== null;

  // idle drift in orbit mode
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!isCarousel) rotation.set(rotation.get() + dt * 4); // 4 deg/sec
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [rotation, isCarousel]);

  const next = () =>
    setSelectedIdx((i) => (i === null ? 0 : (i + 1) % WORKS.length));
  const prev = () =>
    setSelectedIdx((i) =>
      i === null ? 0 : (i - 1 + WORKS.length) % WORKS.length,
    );

  // wheel / touch
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let lastWheelAt = 0;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isCarousel) {
        // throttle so each click of the wheel advances at most once per 320 ms
        const now = performance.now();
        if (now - lastWheelAt < 320) return;
        if (Math.abs(e.deltaY) < 10) return;
        lastWheelAt = now;
        if (e.deltaY > 0) next();
        else prev();
        return;
      }
      rotation.set(rotation.get() + e.deltaY * 0.35);
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const dy = e.touches[0].clientY - touchY;
      touchY = e.touches[0].clientY;
      if (isCarousel) {
        if (dy < -40) {
          next();
          touchY = e.touches[0].clientY;
        } else if (dy > 40) {
          prev();
          touchY = e.touches[0].clientY;
        }
        return;
      }
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

  // keyboard nav in carousel
  useEffect(() => {
    if (!isCarousel) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIdx(null);
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
      if (e.key === "Enter" && selectedIdx !== null) {
        router.push(`/work/${WORKS[selectedIdx].slug}`);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isCarousel, selectedIdx, router]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {isCarousel ? (
          <CarouselView
            key="carousel"
            idx={selectedIdx}
            onClose={() => setSelectedIdx(null)}
            onPrev={prev}
            onNext={next}
            onOpen={(slug) => router.push(`/work/${slug}`)}
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
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black" />

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-10 text-center px-6 max-w-[40ch]">
        <p className="text-[16.5px] sm:text-[17.5px] leading-[1.5] tracking-[-0.005em] text-black/85">
          AI-native studio building brands and web
          <br className="hidden sm:block" /> experiences for high-growth startups
        </p>
      </div>

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
  idx,
  onClose,
  onPrev,
  onNext,
  onOpen,
}: {
  idx: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onOpen: (slug: string) => void;
}) {
  const prevIdx = (idx - 1 + WORKS.length) % WORKS.length;
  const nextIdx = (idx + 1) % WORKS.length;
  const current = WORKS[idx];
  const prevWork = WORKS[prevIdx];
  const nextWork = WORKS[nextIdx];

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
        className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#0a0a0a] text-white flex items-center justify-center hover:bg-zinc-800 transition-colors"
      >
        <Arrow direction="left" />
      </button>

      {/* peek: previous item, top */}
      <PeekItem work={prevWork} position="top" onClick={onPrev} />

      {/* current item, centre */}
      <motion.figure
        key={current.id}
        initial={{ opacity: 0, scale: 0.94, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: -8 }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
        className="flex flex-col items-center gap-5"
      >
        <button
          type="button"
          onClick={() => onOpen(current.slug)}
          aria-label={`View ${current.title} case study`}
          className="relative rounded-full overflow-hidden ring-1 ring-black/10 shadow-[0_18px_60px_rgba(0,0,0,0.09)] cursor-pointer"
          style={{
            width: "min(58vmin, 540px)",
            height: "min(58vmin, 540px)",
          }}
        >
          <MockThumb work={current} />
        </button>
        <figcaption className="text-center">
          <div className="text-[26px] font-medium tracking-[-0.01em] text-black/90">
            {current.title}
          </div>
        </figcaption>
      </motion.figure>

      {/* peek: next item, bottom */}
      <PeekItem work={nextWork} position="bottom" onClick={onNext} />

      <button
        type="button"
        onClick={onNext}
        aria-label="Next project"
        className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#0a0a0a] text-white flex items-center justify-center hover:bg-zinc-800 transition-colors"
      >
        <Arrow direction="right" />
      </button>

      <button
        type="button"
        onClick={onClose}
        aria-label="Back to overview"
        className="absolute inset-x-0 top-0 h-24 sm:h-32 cursor-zoom-out"
      />
    </motion.div>
  );
}

function PeekItem({
  work,
  position,
  onClick,
}: {
  work: Work;
  position: "top" | "bottom";
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={`${position === "top" ? "Previous" : "Next"} — ${work.title}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, delay: 0.05 }}
      className={`absolute left-1/2 -translate-x-1/2 rounded-full overflow-hidden ring-1 ring-black/5 shadow-[0_4px_18px_rgba(0,0,0,0.06)] cursor-pointer ${
        position === "top"
          ? "-translate-y-[calc(50%+34vmin)]"
          : "translate-y-[calc(50%+22vmin)]"
      }`}
      style={{
        top: "50%",
        width: "min(22vmin, 200px)",
        height: "min(22vmin, 200px)",
      }}
    >
      <MockThumb work={work} />
    </motion.button>
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
      <path
        d="M3 7 H11 M7 3 L11 7 L7 11"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
