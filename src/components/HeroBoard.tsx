"use client";

import { useEffect, useRef } from "react";

/**
 * A dark "LED board" hero: a grid of soft dots fills the viewport, and a
 * neon-bright subset lights up to render the studio name as it scrolls
 * left → right across the board, continuously.
 *
 * Implementation: the text is rasterised once into an offscreen canvas
 * at the right pixel height, then each visible grid cell samples that
 * raster (with a horizontal offset that advances every frame) to decide
 * whether to light up.
 */

const TEXT = "Kiosk agency · Kiosk agency · ";
const DOT_SIZE = 6;
const DOT_GAP = 14;
const SPEED_PX_PER_FRAME = 1.1; // ~66 px/sec @ 60 fps

export function HeroBoard() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Offscreen text raster
    const off = document.createElement("canvas");
    const offCtx = off.getContext("2d");
    if (!offCtx) return;

    let imgData: ImageData | null = null;
    let textWidth = 0;
    let textRowsHigh = 0;
    let textRowStart = 0;
    let cols = 0;
    let rows = 0;
    let originX = 0;
    let originY = 0;

    let offsetX = 0; // shrinking value → text moves rightward on screen
    let raf = 0;

    function rasterise(rowsForText: number) {
      const fontSize = rowsForText * DOT_GAP * 0.86;
      // Measure first to size the offscreen canvas
      offCtx!.font = `900 ${fontSize}px "Arial Black", "Inter", system-ui, sans-serif`;
      const metrics = offCtx!.measureText(TEXT);
      // Two repeats so the seam is invisible while scrolling
      const measured = Math.ceil(metrics.width);
      const padding = DOT_GAP * 4;
      off.width = measured + padding * 2;
      off.height = rowsForText * DOT_GAP;

      offCtx!.fillStyle = "#000";
      offCtx!.fillRect(0, 0, off.width, off.height);

      offCtx!.font = `900 ${fontSize}px "Arial Black", "Inter", system-ui, sans-serif`;
      offCtx!.fillStyle = "#fff";
      offCtx!.textBaseline = "middle";
      offCtx!.fillText(TEXT, padding, off.height / 2);

      textWidth = measured; // wrap on the measured width so the repeat aligns
      imgData = offCtx!.getImageData(0, 0, off.width, off.height);
      textRowsHigh = rowsForText;
    }

    function resize() {
      const cssW = wrap!.clientWidth;
      const cssH = wrap!.clientHeight;
      canvas!.width = Math.floor(cssW * dpr);
      canvas!.height = Math.floor(cssH * dpr);
      canvas!.style.width = cssW + "px";
      canvas!.style.height = cssH + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.floor(cssW / DOT_GAP);
      rows = Math.floor(cssH / DOT_GAP);
      originX = (cssW - cols * DOT_GAP) / 2 + DOT_GAP / 2;
      originY = (cssH - rows * DOT_GAP) / 2 + DOT_GAP / 2;

      const textRowsTarget = Math.max(7, Math.min(13, Math.floor(rows * 0.35)));
      rasterise(textRowsTarget);
      textRowStart = Math.floor((rows - textRowsHigh) / 2);
    }

    function tick() {
      if (!imgData) {
        raf = requestAnimationFrame(tick);
        return;
      }

      // black background
      ctx!.fillStyle = "#0a0a0a";
      ctx!.fillRect(0, 0, canvas!.width / dpr, canvas!.height / dpr);

      const data = imgData.data;
      const w = off.width;
      const textH = textRowsHigh * DOT_GAP;

      for (let row = 0; row < rows; row++) {
        const cy = originY + row * DOT_GAP;
        const insideText = row >= textRowStart && row < textRowStart + textRowsHigh;

        for (let col = 0; col < cols; col++) {
          const cx = originX + col * DOT_GAP;
          let on = false;

          if (insideText) {
            // sample the offscreen raster — wrap so the marquee loops
            let sx = (col * DOT_GAP + Math.floor(offsetX) + DOT_GAP / 2) % textWidth;
            if (sx < 0) sx += textWidth;
            const sy = (row - textRowStart) * DOT_GAP + DOT_GAP / 2;
            const idx = (sy * w + sx) * 4;
            const alpha = data[idx];
            on = alpha > 110;
          }

          if (on) {
            // glow first
            ctx!.fillStyle = "rgba(255,255,255,0.18)";
            ctx!.beginPath();
            ctx!.arc(cx, cy, DOT_SIZE * 1.4, 0, Math.PI * 2);
            ctx!.fill();
            ctx!.fillStyle = "#ffffff";
            ctx!.beginPath();
            ctx!.arc(cx, cy, DOT_SIZE / 2, 0, Math.PI * 2);
            ctx!.fill();
          } else {
            ctx!.fillStyle = "rgba(255,255,255,0.07)";
            ctx!.beginPath();
            ctx!.arc(cx, cy, DOT_SIZE / 2, 0, Math.PI * 2);
            ctx!.fill();
          }
        }
      }

      // advance — text moves rightward (left edge enters first, right exits)
      offsetX -= SPEED_PX_PER_FRAME;
      // keep the offset bounded; sampling wraps via modulo anyway
      if (offsetX < -textWidth * 2) offsetX += textWidth;

      // silence the unused variable warning in some toolchains
      void textH;

      raf = requestAnimationFrame(tick);
    }

    resize();
    raf = requestAnimationFrame(tick);

    const ro = new ResizeObserver(() => resize());
    ro.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <section
      ref={wrapRef}
      className="relative w-full h-[100dvh] overflow-hidden bg-[#0a0a0a]"
      aria-label="Kiosk agency"
    >
      <canvas ref={canvasRef} className="absolute inset-0 block" />

      <div className="pointer-events-none absolute bottom-10 left-6 sm:left-10 text-white/55 text-[11px] tracking-[0.24em] uppercase">
        Studio · 2026
      </div>
      <div className="pointer-events-none absolute bottom-10 right-6 sm:right-10 text-white/55 text-[11px] tracking-[0.24em] uppercase">
        Scroll down
      </div>
      <div className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 text-[11px]">
        © {new Date().getFullYear()}
      </div>
    </section>
  );
}
