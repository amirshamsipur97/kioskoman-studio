"use client";

import {
  motion,
  type MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { WORKS, type Work } from "@/lib/works";
import { MockThumb } from "./MockThumb";

/**
 * One scroll value drives every phase of the homepage:
 *
 *   0.00 ─ tiny orbit, headline 1
 *   0.33 ─ medium orbit, headline 2
 *   0.55 ─ full orbit, headline 3 fading in
 *   0.65 ─ orbit fades out, focused thumbnail fades in
 *   0.85 ─ focused thumbnail morphs from circle to a wide rectangle
 *   1.00 ─ router pushes to that work's case-study page
 *
 * Scrolling backward at any point reverses every step. The focused
 * work is locked in once progress crosses 0.6 so the morph doesn't
 * swap targets mid-flight.
 */

const FOCUS_ANGLE = 270;
const SCROLL_BUDGET_PX = 2800;
const NAV_OVERSHOOT_PX = 600; // extra forward scroll after progress=1 to commit
const CENTRE_TEXTS = [
  "AI-native studio building brands and web\nexperiences for high-growth startups",
  "Crafted from first principles —\npositioning, brand, and product in one room",
  "Ready to ship. Keep scrolling\nto step inside a project",
];

export function OrbitStage() {
  const router = useRouter();

  const rotation = useMotionValue(0);
  const smoothRotation = useSpring(rotation, {
    stiffness: 38,
    damping: 28,
    mass: 1.1,
  });

  // raw scroll progress 0..1, smoothed with a spring for the visual
  const progressRaw = useMotionValue(0);
  const progress = useSpring(progressRaw, {
    stiffness: 90,
    damping: 24,
    mass: 0.8,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAccum = useRef(0);
  const navLockRef = useRef(false);

  const [textIdx, setTextIdx] = useState(0);
  const [focusedIdx, setFocusedIdx] = useState<number | null>(null);

  // ── derived motion values ────────────────────────────────────────────
  const orbitScale = useTransform(progress, [0, 0.55], [0.55, 1.2]);
  const orbitOpacity = useTransform(progress, [0.5, 0.68], [1, 0]);
  const headlineOpacity = useTransform(
    progress,
    [0, 0.05, 0.55, 0.62],
    [0, 1, 1, 0],
  );
  const centreDotOpacity = useTransform(progress, [0.55, 0.62], [1, 0]);
  const focusOpacity = useTransform(progress, [0.55, 0.7], [0, 1]);
  const focusScale = useTransform(progress, [0.55, 0.78], [0.4, 1]);

  const morphP = useTransform(progress, [0.78, 1], [0, 1], { clamp: true });
  const focusW = useTransform(
    morphP,
    [0, 1],
    ["58vmin", "min(92vw, 1180px)"],
  );
  const focusH = useTransform(morphP, [0, 1], ["58vmin", "62vh"]);
  const focusR = useTransform(morphP, [0, 1], ["9999px", "24px"]);
  const focusY = useTransform(morphP, [0, 1], ["0%", "-12%"]);

  // ── progress side-effects ────────────────────────────────────────────
  function pickNearest() {
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
    return bestIdx;
  }

  useMotionValueEvent(progressRaw, "change", (p) => {
    // text index
    const slot = Math.min(
      CENTRE_TEXTS.length - 1,
      Math.floor(p * CENTRE_TEXTS.length * 0.95),
    );
    setTextIdx((curr) => (curr === slot ? curr : slot));

    // lock in / release the focused work
    if (p > 0.55 && focusedIdx === null) {
      setFocusedIdx(pickNearest());
    } else if (p < 0.4 && focusedIdx !== null) {
      setFocusedIdx(null);
    }
  });

  // ── idle rotation drift ──────────────────────────────────────────────
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      // only drift while the orbit is still on stage
      if (progressRaw.get() < 0.6) {
        rotation.set(rotation.get() + dt * 3);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [rotation, progressRaw]);

  // ── wheel / touch ────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const commit = () => {
      if (navLockRef.current) return;
      if (focusedIdx === null) return;
      navLockRef.current = true;
      router.push(`/work/${WORKS[focusedIdx].slug}`);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (navLockRef.current) return;

      // rotation tracks signed delta for natural spin
      rotation.set(rotation.get() + e.deltaY * 0.18);

      // signed accumulation so scroll-up reverses everything
      scrollAccum.current = Math.max(
        0,
        Math.min(
          SCROLL_BUDGET_PX + NAV_OVERSHOOT_PX,
          scrollAccum.current + e.deltaY,
        ),
      );
      progressRaw.set(
        Math.min(1, scrollAccum.current / SCROLL_BUDGET_PX),
      );

      if (scrollAccum.current >= SCROLL_BUDGET_PX + NAV_OVERSHOOT_PX) {
        commit();
      }
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (navLockRef.current) return;
      const dy = e.touches[0].clientY - touchY;
      touchY = e.touches[0].clientY;
      rotation.set(rotation.get() - dy * 0.5);
      // dragging up (dy<0) advances forward, like a scroll wheel
      scrollAccum.current = Math.max(
        0,
        Math.min(
          SCROLL_BUDGET_PX + NAV_OVERSHOOT_PX,
          scrollAccum.current - dy * 6,
        ),
      );
      progressRaw.set(
        Math.min(1, scrollAccum.current / SCROLL_BUDGET_PX),
      );
      if (scrollAccum.current >= SCROLL_BUDGET_PX + NAV_OVERSHOOT_PX) {
        commit();
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [rotation, progressRaw, focusedIdx, router]);

  const focusedWork = focusedIdx === null ? null : WORKS[focusedIdx];
  const centreText = CENTRE_TEXTS[textIdx] ?? CENTRE_TEXTS[0];

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
    >
      {/* centre dot */}
      <motion.span
        style={{ opacity: centreDotOpacity }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black"
      />

      {/* headline */}
      <motion.div
        style={{ opacity: headlineOpacity }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-8 text-center px-6 w-[44ch] max-w-[88vw]"
      >
        <motion.p
          key={textIdx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="text-[13.5px] sm:text-[14px] leading-[1.5] tracking-[-0.005em] text-black/75 whitespace-pre-line"
        >
          {centreText}
        </motion.p>
      </motion.div>

      {/* orbiting thumbs (fade out as focus takes over) */}
      <motion.div
        style={{ scale: orbitScale, opacity: orbitOpacity }}
        className="absolute inset-0"
      >
        {WORKS.map((w, i) => (
          <OrbitItem
            key={w.id}
            work={w}
            smooth={smoothRotation}
            onClick={() => {
              if (navLockRef.current) return;
              navLockRef.current = true;
              router.push(`/work/${WORKS[i].slug}`);
            }}
          />
        ))}
      </motion.div>

      {/* focused item — fades in, scales up, then morphs to a rectangle */}
      {focusedWork && (
        <FocusedItem
          work={focusedWork}
          opacity={focusOpacity}
          scale={focusScale}
          width={focusW}
          height={focusH}
          borderRadius={focusR}
          translateY={focusY}
        />
      )}
    </div>
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

/* ------------------------------- Focused item ------------------------------ */

function FocusedItem({
  work,
  opacity,
  scale,
  width,
  height,
  borderRadius,
  translateY,
}: {
  work: Work;
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
  width: MotionValue<string>;
  height: MotionValue<string>;
  borderRadius: MotionValue<string>;
  translateY: MotionValue<string>;
}) {
  return (
    <motion.div
      style={{ opacity, scale, y: translateY }}
      className="absolute pointer-events-none"
    >
      <motion.div
        style={{ width, height, borderRadius }}
        className="overflow-hidden ring-1 ring-black/5 shadow-[0_30px_80px_rgba(0,0,0,0.12)]"
      >
        <MockThumb work={work} />
      </motion.div>
    </motion.div>
  );
}
