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
 *
 * Interaction:
 * - Wheel / touch rotates the whole orbit together — softly.
 * - After enough cumulative scroll the closest-to-front thumbnail zooms
 *   to full-screen and the router navigates to its case study.
 * - Click any thumbnail to open carousel mode (peek prev/next).
 * - In carousel mode, clicking the centre image opens the case study.
 */

const FOCUS_ANGLE = 270; // top of the viewport feels like "next up"
const ZOOM_TRIGGER_PX = 1800; // accumulated wheel delta before zoom fires
const ZOOM_DURATION_MS = 900; // wait this long before navigating

export function OrbitStage() {
  const router = useRouter();
  const rotation = useMotionValue(0); // degrees
  const smooth = useSpring(rotation, { stiffness: 38, damping: 28, mass: 1.1 });
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAccum = useRef(0);

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [zoomIdx, setZoomIdx] = useState<number | null>(null);
  const isCarousel = selectedIdx !== null;
  const isZooming = zoomIdx !== null;

  // idle drift in orbit mode (paused while carousel/zoom is active)
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!isCarousel && !isZooming) {
        rotation.set(rotation.get() + dt * 3); // 3 deg/sec — gentle
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [rotation, isCarousel, isZooming]);

  const next = () =>
    setSelectedIdx((i) => (i === null ? 0 : (i + 1) % WORKS.length));
  const prev = () =>
    setSelectedIdx((i) =>
      i === null ? 0 : (i - 1 + WORKS.length) % WORKS.length,
    );

  function triggerZoom() {
    // find the work currently closest to the FOCUS_ANGLE (in screen space)
    const r = ((rotation.get() % 360) + 360) % 360;
    let bestIdx = 0;
    let bestDist = Infinity;
    WORKS.forEach((w, i) => {
      const displayed = ((w.angle + r) % 360 + 360) % 360;
      const d = Math.min(
        Math.abs(displayed - FOCUS_ANGLE),
        360 - Math.abs(displayed - FOCUS_ANGLE),
      );
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    });
    setZoomIdx(bestIdx);
    scrollAccum.current = 0;
    window.setTimeout(() => {
      router.push(`/work/${WORKS[bestIdx].slug}`);
    }, ZOOM_DURATION_MS);
  }

  // wheel / touch
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let lastWheelAt = 0;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isZooming) return;
      if (isCarousel) {
        const now = performance.now();
        if (now - lastWheelAt < 320) return;
        if (Math.abs(e.deltaY) < 10) return;
        lastWheelAt = now;
        if (e.deltaY > 0) next();
        else prev();
        return;
      }

      // softer rotation factor — feels like gliding rather than jumping
      rotation.set(rotation.get() + e.deltaY * 0.18);

      // accumulate magnitude to detect "user has scrolled enough"
      scrollAccum.current += Math.abs(e.deltaY);
      if (scrollAccum.current > ZOOM_TRIGGER_PX) {
        triggerZoom();
      }
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const dy = e.touches[0].clientY - touchY;
      touchY = e.touches[0].clientY;
      if (isZooming) return;
      if (isCarousel) {
        if (dy < -40) next();
        else if (dy > 40) prev();
        return;
      }
      rotation.set(rotation.get() - dy * 0.55);
      scrollAccum.current += Math.abs(dy) * 6; // touch counts faster
      if (scrollAccum.current > ZOOM_TRIGGER_PX) triggerZoom();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotation, isCarousel, isZooming]);

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
        {isZooming ? (
          <ZoomView key="zoom" work={WORKS[zoomIdx]} />
        ) : isCarousel ? (
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

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-8 text-center px-6 max-w-[40ch]">
        <p className="text-[13px] sm:text-[13.5px] leading-[1.5] tracking-[-0.005em] text-black/75">
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

/* --------------------------------- Zoom view -------------------------------- */

function ZoomView({ work }: { work: Work }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <motion.div
        initial={{
          width: "12vmin",
          height: "12vmin",
          borderRadius: "9999px",
        }}
        animate={{
          width: "180vmax",
          height: "180vmax",
          borderRadius: "0px",
        }}
        transition={{
          duration: ZOOM_DURATION_MS / 1000,
          ease: [0.65, 0, 0.35, 1],
        }}
        className="overflow-hidden ring-1 ring-black/5 shadow-[0_8px_60px_rgba(0,0,0,0.18)]"
      >
        <MockThumb work={work} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.3 }}
        className="absolute bottom-12 left-0 right-0 text-center"
      >
        <div className="text-[12px] tracking-[0.18em] uppercase text-white/70">
          {work.tag}
        </div>
        <div className="text-[28px] font-medium text-white tracking-[-0.01em]">
          {work.title}
        </div>
      </motion.div>
    </motion.div>
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

      <PeekItem work={prevWork} position="top" onClick={onPrev} />

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
