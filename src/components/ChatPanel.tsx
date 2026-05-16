"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { SpinnerDots } from "./SpinnerDots";

type Tab = "chat" | "contact";
type Status = "idle" | "sending" | "ok" | "error";

const QUICK_CHIPS = [
  { label: "Where should I start?", active: true },
  { label: "What do you do?", active: false },
  { label: "I have a project", active: false },
];

export function ChatPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>("chat");
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-label="Chat with our AI assistant"
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="fixed left-6 bottom-6 z-50 w-[340px] h-[540px] rounded-[26px] bg-[#0a0a0a] text-white shadow-2xl flex flex-col overflow-hidden"
          style={{ transformOrigin: "bottom left" }}
        >
          <Header tab={tab} onTab={setTab} onClose={onClose} />
          <div className="flex-1 overflow-hidden">
            {tab === "chat" ? <ChatTab /> : <ContactTab />}
          </div>
          {tab === "chat" && (
            <ChatInput value={draft} onChange={setDraft} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* --------------------------------- header --------------------------------- */

function Header({
  tab,
  onTab,
  onClose,
}: {
  tab: Tab;
  onTab: (t: Tab) => void;
  onClose: () => void;
}) {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-4 text-[13px]">
        <TabBtn label="Chat" active={tab === "chat"} onClick={() => onTab("chat")} />
        <TabBtn label="Contact" active={tab === "contact"} onClick={() => onTab("contact")} />
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close chat"
        className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center transition-colors"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
          <path d="M1 1 L9 9 M9 1 L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

function TabBtn({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative pb-0.5"
      aria-pressed={active}
    >
      <span className={active ? "text-white" : "text-white/45 hover:text-white/70 transition-colors"}>
        {label}
      </span>
      {active && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white" />
      )}
    </button>
  );
}

/* --------------------------------- chat tab ------------------------------- */

function ChatTab() {
  return (
    <div className="h-full flex flex-col">
      <div
        className="flex-1 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(180deg, transparent 30%, #0a0a0a 92%), url('/remi.svg')",
        }}
        aria-hidden
      />
      <div className="px-5 pb-3 -mt-24 relative">
        <p className="text-[11px] tracking-[0.18em] text-white/45 uppercase mb-1.5">
          Remi
        </p>
        <p className="text-[16px] leading-[1.45] text-white/95">
          Hey — I&apos;m Remi, Kioskoman&apos;s AI assistant.
          <br />
          Anything catch your eye?
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {QUICK_CHIPS.map((c) => (
            <button
              key={c.label}
              type="button"
              className={
                c.active
                  ? "rounded-full bg-white/95 text-black text-[12.5px] px-3 py-1.5 hover:bg-white transition-colors"
                  : "rounded-full bg-white/8 text-white/70 text-[12.5px] px-3 py-1.5 hover:bg-white/15 transition-colors"
              }
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChatInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // Demo only — wire to a real assistant later.
        onChange("");
      }}
      className="flex items-center gap-2 px-4 pb-4 pt-2"
    >
      <span className="text-white/70 pl-1">
        <SpinnerDots size={18} />
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ask me anything..."
        className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-white/40"
      />
    </form>
  );
}

/* -------------------------------- contact tab ----------------------------- */

function ContactTab() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorText, setErrorText] = useState("");

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

  if (status === "ok") {
    return (
      <div className="px-5 pt-16 pb-6 h-full flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 rounded-full bg-white text-black grid place-items-center mb-3">
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
            <path d="M3 8 L7 12 L13 4" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-[15px] text-white/90">Thanks — we&apos;ll be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col gap-2.5 px-5 pt-14 pb-4">
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="chat-input"
      />
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="chat-input"
      />
      <textarea
        required
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Tell us what you're building"
        className="chat-input resize-none flex-1"
      />
      {status === "error" && (
        <p className="text-[12px] text-red-300">{errorText}</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-1 rounded-full bg-white text-black h-10 text-[13.5px] font-medium hover:bg-white/90 disabled:opacity-60 transition-colors"
      >
        {status === "sending" ? "Sending…" : "Send"}
      </button>

      <style jsx>{`
        :global(.chat-input) {
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.04);
          color: white;
          border-radius: 12px;
          padding: 10px 12px;
          font-size: 13.5px;
          outline: none;
          transition: border-color 0.15s, background-color 0.15s;
        }
        :global(.chat-input)::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
        :global(.chat-input:focus) {
          border-color: rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.07);
        }
      `}</style>
    </form>
  );
}
