"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type Status = "idle" | "sending" | "ok" | "error";

export function ContactModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setErrorText("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setStatus("ok");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setErrorText(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-label="Contact"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[min(92vw,460px)] rounded-2xl bg-white p-7 shadow-2xl ring-1 ring-black/10"
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Let&apos;s work together</h2>
                <p className="text-sm text-black/55 mt-1">
                  Tell us what you&apos;re building.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-full w-8 h-8 grid place-items-center hover:bg-black/5"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                  <path d="M2 2 L12 12 M12 2 L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {status === "ok" ? (
              <div className="py-6 text-center">
                <div className="mx-auto mb-3 w-10 h-10 rounded-full bg-black text-white grid place-items-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                    <path d="M3 8 L7 12 L13 4" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="font-medium">Thanks — we&apos;ll be in touch shortly.</p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-4 text-sm text-black/60 underline underline-offset-2"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <Field label="Name">
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                    autoComplete="name"
                  />
                </Field>
                <Field label="Email">
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                    autoComplete="email"
                  />
                </Field>
                <Field label="Project">
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="input resize-none"
                  />
                </Field>

                {status === "error" && (
                  <p className="text-sm text-red-600">{errorText}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="mt-1 rounded-full bg-black text-white px-5 h-11 text-sm font-medium hover:bg-zinc-800 disabled:opacity-60 transition-colors"
                >
                  {status === "sending" ? "Sending…" : "Send"}
                </button>
              </form>
            )}

            <style jsx>{`
              .input {
                width: 100%;
                border: 1px solid rgba(0, 0, 0, 0.12);
                border-radius: 12px;
                padding: 10px 12px;
                font-size: 14px;
                outline: none;
                background: #fafaf7;
                transition: border-color 0.15s;
              }
              .input:focus {
                border-color: #0a0a0a;
              }
            `}</style>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] tracking-[0.16em] uppercase text-black/55">
        {label}
      </span>
      {children}
    </label>
  );
}
