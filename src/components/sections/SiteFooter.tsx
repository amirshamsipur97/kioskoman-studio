import Link from "next/link";
import { Logo } from "@/components/Logo";

const PRIMARY = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "How we work", href: "#approach" },
  { label: "FAQ", href: "#faq" },
];

const RESOURCES = [
  { label: "Writing", href: "#writing" },
  { label: "Twitter / X", href: "https://x.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Terms of Service", href: "#terms" },
];

export function SiteFooter() {
  return (
    <footer className="relative w-full px-6 pt-20 pb-10 bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-14 border-b border-white/10">
          <div className="md:col-span-6 flex flex-col gap-6">
            <div className="text-white">
              <Logo />
            </div>
            <p className="text-[15px] leading-[1.55] text-white/65 max-w-[36ch]">
              An AI-native studio building brands and web experiences for
              high-growth startups. Based remotely, shipping globally.
            </p>
            <Link
              href="#contact"
              className="self-start rounded-full bg-white text-black px-5 h-11 inline-flex items-center text-[13.5px] font-medium hover:bg-white/90 transition-colors"
            >
              Start a project →
            </Link>
          </div>

          <div className="md:col-span-3">
            <p className="text-[10.5px] tracking-[0.22em] uppercase text-white/45 mb-4">
              Site
            </p>
            <ul className="flex flex-col gap-2">
              {PRIMARY.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-[14px] text-white/75 hover:text-white transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-[10.5px] tracking-[0.22em] uppercase text-white/45 mb-4">
              Resources
            </p>
            <ul className="flex flex-col gap-2">
              {RESOURCES.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-[14px] text-white/75 hover:text-white transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-wrap items-center justify-between gap-3 text-[12px] text-white/45">
          <span>© {new Date().getFullYear()} Kioskoman Studio. All rights reserved.</span>
          <span>Crafted in-house · Deployed on Vercel</span>
        </div>
      </div>
    </footer>
  );
}
