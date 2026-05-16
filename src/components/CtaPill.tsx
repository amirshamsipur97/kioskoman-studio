"use client";

import { SpinnerDots } from "./SpinnerDots";

export function CtaPill({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 left-6 z-40 group flex items-center gap-3 rounded-full bg-[#0a0a0a] text-white py-3 pl-3 pr-5 text-sm font-medium shadow-lg hover:bg-black transition-colors"
    >
      <span className="text-white">
        <SpinnerDots size={20} />
      </span>
      <span>Let&apos;s work together</span>
    </button>
  );
}
