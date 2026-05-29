"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { gsap } from "gsap";
import { WORKS, type Work } from "@/lib/works";

/**
 * Three.js orbit + GSAP-driven focus → fullscreen handoff.
 *
 *   1. Eight circular plane meshes sit on a ring in 3-D space and rotate
 *      slowly. Wheel / touch boosts the rotation.
 *   2. Once cumulative rotation reaches 3 full turns, the orbit decelerates
 *      and the thumbnail closest to the top of the screen is picked.
 *   3. An HTML overlay sized to that thumbnail fades in over the WebGL
 *      canvas, then GSAP morphs it to fill the viewport with border-radius
 *      easing from 50% to 0 — no intermediate floating rectangle.
 *   4. When the morph completes, the router pushes to the work's page.
 */

const RADIUS = 1.85; // world-space radius of the ring
const ITEM_SIZE = 0.34; // mesh radius
const CAMERA_Z = 5;
const FOV = 40;
const ROTATIONS_BEFORE_FOCUS = 3;

const CENTRE_TEXTS = [
  "AI-native studio building brands and web\nexperiences for high-growth startups",
  "Crafted from first principles —\npositioning, brand, and product in one room",
  "Ready to ship. Keep scrolling\nto step inside a project",
];

function tileLabelFor(work: Work) {
  return (work.label ?? work.title).toUpperCase();
}

function makeTileTexture(work: Work) {
  const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2);
  const size = 512 * dpr;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Texture();

  // background — black for label tiles, warm gradient otherwise
  if (work.pattern === "label") {
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, size, size);
  } else {
    const g = ctx.createRadialGradient(size * 0.5, size * 0.38, size * 0.05, size * 0.5, size * 0.5, size * 0.6);
    g.addColorStop(0, "#f4eee2");
    g.addColorStop(0.65, work.hue);
    g.addColorStop(1, "#0a0a0a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }

  // label text (used for all tiles in the Three.js scene for consistency)
  const text = tileLabelFor(work);
  const isDark = work.pattern === "label" || work.hue.startsWith("#1") || work.hue.startsWith("#2");
  ctx.fillStyle = isDark ? "#ffffff" : "#0a0a0a";
  const fontSize = (text.length <= 12 ? 56 : text.length <= 18 ? 44 : 34) * dpr;
  ctx.font = `500 ${fontSize}px "Geist", system-ui, -apple-system, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, size * 0.5, size * 0.5);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

export function OrbitStage() {
  const router = useRouter();
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [textIdx, setTextIdx] = useState(0);

  useEffect(() => {
    const container = canvasContainerRef.current;
    const overlayEl = overlayRef.current;
    if (!container || !overlayEl) return;
    const overlay: HTMLDivElement = overlayEl;

    let width = container.clientWidth;
    let height = container.clientHeight;

    // ── three.js scene ──────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, width / height, 0.1, 100);
    camera.position.z = CAMERA_Z;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    const geometry = new THREE.CircleGeometry(ITEM_SIZE, 64);
    const meshes: THREE.Mesh[] = [];
    const textures: THREE.Texture[] = [];

    WORKS.forEach((work, i) => {
      const a = (work.angle * Math.PI) / 180;
      const tex = makeTileTexture(work);
      textures.push(tex);
      const material = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(Math.cos(a) * RADIUS, -Math.sin(a) * RADIUS, 0);
      mesh.userData = { work, idx: i };
      orbitGroup.add(mesh);
      meshes.push(mesh);
    });

    // ── interaction + timeline state ────────────────────────────────────
    let netRotation = 0; // signed cumulative rotation (radians)
    let scrollLocked = false;
    let idleTween: gsap.core.Tween | null = null;
    const TURNS_FULL = ROTATIONS_BEFORE_FOCUS * Math.PI * 2;

    // slow idle drift via gsap (killed on first user input)
    idleTween = gsap.to(orbitGroup.rotation, {
      z: orbitGroup.rotation.z - Math.PI * 2,
      duration: 28,
      ease: "none",
      repeat: -1,
    });

    function updateText() {
      const turnFraction = Math.abs(netRotation) / (Math.PI * 2);
      const slot = Math.min(
        CENTRE_TEXTS.length - 1,
        Math.floor((turnFraction / ROTATIONS_BEFORE_FOCUS) * CENTRE_TEXTS.length),
      );
      setTextIdx((curr) => (curr === slot ? curr : slot));
    }

    function pickFocusMesh() {
      // closest to top of screen → largest world-Y after group rotation
      let bestIdx = 0;
      let bestY = -Infinity;
      const v = new THREE.Vector3();
      meshes.forEach((m, i) => {
        m.getWorldPosition(v);
        if (v.y > bestY) {
          bestY = v.y;
          bestIdx = i;
        }
      });
      return bestIdx;
    }

    function projectedRect(mesh: THREE.Mesh) {
      // returns the on-screen position + diameter of a mesh
      const world = new THREE.Vector3();
      mesh.getWorldPosition(world);
      const projected = world.clone().project(camera);
      const cx = (projected.x * 0.5 + 0.5) * width;
      const cy = (-projected.y * 0.5 + 0.5) * height;
      // width by projecting two side points
      const a = new THREE.Vector3(world.x - ITEM_SIZE, world.y, world.z).project(camera);
      const b = new THREE.Vector3(world.x + ITEM_SIZE, world.y, world.z).project(camera);
      const diameter = Math.abs((b.x - a.x) * 0.5 * width);
      return { cx, cy, diameter };
    }

    function commitFocus() {
      if (scrollLocked) return;
      scrollLocked = true;
      idleTween?.kill();

      const focusIdx = pickFocusMesh();
      const focused = meshes[focusIdx];
      const work = focused.userData.work as Work;

      // 1) decelerate the orbit's rotation
      gsap.to(orbitGroup.rotation, {
        z: orbitGroup.rotation.z,
        duration: 0.6,
        ease: "power3.out",
      });

      // 2) prep HTML overlay sized + positioned over the focused mesh
      const { cx, cy, diameter } = projectedRect(focused);
      overlay.style.display = "block";
      overlay.style.left = `${cx}px`;
      overlay.style.top = `${cy}px`;
      overlay.style.width = `${diameter}px`;
      overlay.style.height = `${diameter}px`;
      overlay.style.borderRadius = "50%";
      overlay.style.transform = "translate(-50%, -50%)";
      overlay.style.opacity = "0";
      overlay.style.background = work.pattern === "label" ? "#0a0a0a" : work.hue;
      overlay.style.color = "#ffffff";

      const text = tileLabelFor(work);
      overlay.innerHTML = `<span style="font-size:clamp(14px,1.6vmin,28px);letter-spacing:0.18em;font-weight:500;">${text}</span>`;

      // 3) main timeline: pop the overlay in, fade WebGL out, then fullscreen morph
      const tl = gsap.timeline({
        onComplete: () => router.push(`/work/${work.slug}`),
      });

      tl.to(overlay, { opacity: 1, duration: 0.25, ease: "power1.out" }, 0);
      tl.to(focused.scale, { x: 1.18, y: 1.18, duration: 0.45, ease: "power2.out" }, 0);
      tl.to(meshes.map((m) => m.material as THREE.MeshBasicMaterial), {
        opacity: 0,
        duration: 0.45,
        ease: "power1.in",
      }, 0.05);

      tl.to(overlay, {
        left: "50%",
        top: "50%",
        width: "100vw",
        height: "100vh",
        borderRadius: "0px",
        duration: 1.05,
        ease: "power3.inOut",
      }, 0.2);

      tl.to(renderer.domElement, { opacity: 0, duration: 0.4, ease: "power1.inOut" }, 0.35);
    }

    function applyDelta(deltaRad: number) {
      if (scrollLocked) return;
      idleTween?.kill();
      idleTween = null;

      orbitGroup.rotation.z -= deltaRad;
      netRotation -= deltaRad;
      updateText();

      if (Math.abs(netRotation) >= TURNS_FULL) commitFocus();
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      applyDelta(e.deltaY * 0.0028);
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const dy = e.touches[0].clientY - touchY;
      touchY = e.touches[0].clientY;
      applyDelta(-dy * 0.008);
    };

    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
    renderer.domElement.addEventListener("touchstart", onTouchStart, { passive: true });
    renderer.domElement.addEventListener("touchmove", onTouchMove, { passive: true });

    // ── animation loop ──────────────────────────────────────────────────
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      renderer.render(scene, camera);
    };
    tick();

    // ── resize ──────────────────────────────────────────────────────────
    const onResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    // ── cleanup ─────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      idleTween?.kill();
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("wheel", onWheel);
      renderer.domElement.removeEventListener("touchstart", onTouchStart);
      renderer.domElement.removeEventListener("touchmove", onTouchMove);
      textures.forEach((t) => t.dispose());
      meshes.forEach((m) => (m.material as THREE.MeshBasicMaterial).dispose());
      geometry.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [router]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div ref={canvasContainerRef} className="absolute inset-0" />

      {/* centre dot */}
      <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black" />

      {/* cycling headline */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-10 text-center px-6 w-[44ch] max-w-[88vw]">
        <p
          key={textIdx}
          className="text-[13.5px] sm:text-[14px] leading-[1.5] tracking-[-0.005em] text-black/75 whitespace-pre-line animate-[fadeUp_500ms_ease-out_both]"
        >
          {CENTRE_TEXTS[textIdx]}
        </p>
      </div>

      {/* focus → fullscreen overlay (GSAP-controlled) */}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute z-30 overflow-hidden flex items-center justify-center text-center"
        style={{ display: "none" }}
      />

      <style jsx global>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>
    </div>
  );
}
