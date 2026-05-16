"use client";

import { AnimatePresence, motion } from "framer-motion";

const PRIMARY = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "Approach", href: "#approach" },
  { label: "Book a Call", href: "#contact" },
];

const RESOURCES = [
  { label: "Writing", href: "#writing", active: true },
  { label: "Twitter / X", href: "https://x.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Terms of Service", href: "#terms" },
];

export function MenuPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 z-30 bg-transparent"
          />
          <motion.div
            role="dialog"
            aria-label="Site menu"
            initial={{ opacity: 0, scale: 0.92, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
            className="fixed top-4 right-4 z-40 w-[320px] rounded-2xl bg-[#0a0a0a] text-[#ededed] p-7 pt-16 shadow-2xl ring-1 ring-black/40"
            style={{ transformOrigin: "top right" }}
          >
            <nav className="flex flex-col gap-3 text-[28px] leading-[1.15] font-semibold tracking-tight">
              {PRIMARY.map((item, i) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={
                    i === 0
                      ? "text-white/45 hover:text-white transition-colors"
                      : "hover:text-white/70 transition-colors"
                  }
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="mt-7 mb-3 h-px bg-white/10" />

            <p className="text-[10px] tracking-[0.18em] text-white/45 uppercase mb-3">
              Resources
            </p>
            <ul className="flex flex-col gap-2 text-[15px]">
              {RESOURCES.map((item) => (
                <li key={item.label} className="flex items-center gap-2">
                  {item.active && (
                    <span className="inline-block w-2 h-2 rounded-full bg-white" />
                  )}
                  <a
                    href={item.href}
                    onClick={onClose}
                    className={
                      item.active
                        ? "text-white"
                        : "text-white/55 hover:text-white transition-colors"
                    }
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
