"use client";

import { SpinnerDots } from "./SpinnerDots";

export function MenuTrigger({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-label="Open menu"
      className="fixed top-6 right-6 z-50 flex items-center gap-3 text-current"
    >
      <span className={open ? "text-white" : "text-black"}>
        <SpinnerDots size={18} />
      </span>
      <span
        className={`grid grid-cols-3 gap-[3px] ${
          open ? "text-white" : "text-black"
        }`}
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={i}
            className="w-[3px] h-[3px] rounded-full bg-current"
          />
        ))}
      </span>
    </button>
  );
}
