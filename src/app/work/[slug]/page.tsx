import { notFound } from "next/navigation";
import { Logo } from "@/components/Logo";
import { MockThumb } from "@/components/MockThumb";
import { SpinnerDots } from "@/components/SpinnerDots";
import { WORKS, workBySlug, type Service } from "@/lib/works";
import { WorkChrome } from "./WorkChrome";

export function generateStaticParams() {
  return WORKS.map((w) => ({ slug: w.slug }));
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = workBySlug(slug);
  if (!work) notFound();

  return (
    <main className="min-h-screen bg-[#fafaf7] text-black">
      <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-5 pointer-events-none">
        <div className="pointer-events-auto">
          <Logo />
        </div>
        <WorkChrome />
      </header>

      <section className="px-6 pt-20 pb-12">
        <div className="mx-auto max-w-[1180px]">
          <div
            className="relative rounded-3xl overflow-hidden ring-1 ring-black/5 shadow-[0_24px_80px_rgba(0,0,0,0.08)]"
            style={{ aspectRatio: "16 / 9" }}
          >
            <div className="absolute inset-0">
              <MockThumb work={work} />
            </div>
            <div className="absolute left-6 bottom-6 text-white/85 mix-blend-difference">
              <div className="text-[42px] sm:text-[56px] font-medium leading-none tracking-[-0.02em]">
                {work.title}
              </div>
              {work.hero.eyebrow && (
                <div className="text-[12px] tracking-[0.18em] uppercase mt-2 text-white/70">
                  {work.hero.eyebrow}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-[820px] text-center">
          <h1 className="text-[36px] sm:text-[44px] leading-[1.08] tracking-[-0.02em] font-medium">
            {work.hero.headline}
          </h1>
          <p className="mt-5 text-[15.5px] sm:text-[16px] leading-[1.55] text-black/65">
            {work.hero.body}
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-[1180px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {work.services.map((s, i) => (
            <ServiceCard key={i} service={s} />
          ))}
        </div>
      </section>

      <div className="fixed bottom-7 right-7 z-30 text-black/70" aria-hidden>
        <SpinnerDots size={22} />
      </div>
    </main>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="rounded-2xl bg-white ring-1 ring-black/8 p-6 flex flex-col gap-3">
      <h3 className="text-[17px] font-medium tracking-tight">{service.title}</h3>
      <p className="text-[13.5px] leading-[1.55] text-black/60">{service.body}</p>
      <a
        href="#"
        className="text-[13px] text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 mt-1"
      >
        Learn More
        <svg width="11" height="11" viewBox="0 0 14 14" aria-hidden>
          <path
            d="M3 7 H11 M7 3 L11 7 L7 11"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
      <div className="mt-3 rounded-xl bg-black/[0.03] ring-1 ring-black/5 p-4 min-h-[140px]">
        <ServicePreview kind={service.preview ?? "doc"} />
      </div>
    </article>
  );
}

function ServicePreview({ kind }: { kind: NonNullable<Service["preview"]> }) {
  if (kind === "list") {
    return (
      <ul className="flex flex-col gap-2 text-[12px]">
        {["Apollo Ventures", "Blue Harbor Capital", "Helix Frontier Partners"].map((n, i) => (
          <li
            key={n}
            className="flex justify-between rounded-lg bg-white ring-1 ring-black/5 px-3 py-2"
          >
            <span className="font-medium text-black/85">{n}</span>
            <span className="text-black/45">
              {["$142K", "$105K", "$2.95M"][i]} committed
            </span>
          </li>
        ))}
      </ul>
    );
  }
  if (kind === "chart") {
    return (
      <div className="h-full">
        <div className="text-[11px] text-black/45 mb-1">Fair Market Value</div>
        <svg viewBox="0 0 200 80" className="w-full h-20">
          <path
            d="M0 60 L 30 50 L 60 55 L 90 35 L 120 28 L 150 40 L 180 22 L 200 30 L 200 80 L 0 80 Z"
            fill="rgba(16,185,129,0.18)"
          />
          <path
            d="M0 60 L 30 50 L 60 55 L 90 35 L 120 28 L 150 40 L 180 22 L 200 30"
            stroke="rgb(16,185,129)"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>
    );
  }
  if (kind === "progress") {
    return (
      <div className="flex flex-col gap-2.5">
        {[
          { label: "Anthropic", value: 86, tone: "emerald" },
          { label: "Altos Inc.", value: 25, tone: "rose" },
          { label: "Beacon AI", value: 70, tone: "emerald" },
          { label: "Beezi", value: 55, tone: "amber" },
        ].map((r) => (
          <div key={r.label} className="flex items-center gap-3 text-[11.5px]">
            <span className="w-20 text-black/75">{r.label}</span>
            <div className="flex-1 h-1.5 rounded-full bg-black/[0.06] overflow-hidden">
              <div
                className={
                  r.tone === "emerald"
                    ? "h-full bg-emerald-500"
                    : r.tone === "rose"
                      ? "h-full bg-rose-400"
                      : "h-full bg-amber-400"
                }
                style={{ width: `${r.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1.5">
      <div className="h-2 rounded-full bg-black/[0.08] w-1/2" />
      <div className="h-2 rounded-full bg-black/[0.06] w-2/3" />
      <div className="h-2 rounded-full bg-black/[0.06] w-1/3" />
    </div>
  );
}
