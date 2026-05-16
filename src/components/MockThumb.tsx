import { Work } from "@/lib/works";

/**
 * Decorative SVG mockup shown inside each circular thumbnail.
 * Roughly mimics monitors / phones / posters from the inspiration site.
 */
export function MockThumb({ work }: { work: Work }) {
  const isDark = work.hue.startsWith("#1") || work.hue.startsWith("#2");
  const text = isDark ? "#fafaf7" : "#0a0a0a";
  const dim = isDark ? "#ffffff20" : "#0a0a0a14";

  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ background: work.hue }}
    >
      {work.pattern === "monitor" && (
        <g>
          <rect x="14" y="20" width="72" height="46" rx="3" fill={text} opacity="0.92" />
          <rect x="18" y="24" width="64" height="38" rx="2" fill={work.hue} opacity="0.18" />
          <rect x="22" y="28" width="20" height="3" rx="1" fill={work.hue} />
          <rect x="22" y="33" width="34" height="2" rx="1" fill={work.hue} opacity="0.7" />
          <rect x="22" y="37" width="28" height="2" rx="1" fill={work.hue} opacity="0.5" />
          <rect x="46" y="68" width="8" height="6" fill={text} opacity="0.92" />
          <rect x="34" y="74" width="32" height="3" rx="1.5" fill={text} opacity="0.92" />
        </g>
      )}
      {work.pattern === "laptop" && (
        <g>
          <path d="M16 26 H84 V60 H16 Z" fill={text} opacity="0.92" />
          <rect x="20" y="30" width="60" height="26" fill={work.hue} opacity="0.2" />
          <path d="M12 60 H88 L84 66 H16 Z" fill={text} opacity="0.85" />
          <circle cx="36" cy="42" r="5" fill={work.hue} opacity="0.55" />
          <rect x="46" y="40" width="22" height="2" rx="1" fill={work.hue} opacity="0.55" />
          <rect x="46" y="45" width="18" height="2" rx="1" fill={work.hue} opacity="0.35" />
        </g>
      )}
      {work.pattern === "phone" && (
        <g>
          <rect x="36" y="14" width="28" height="72" rx="5" fill={text} opacity="0.92" />
          <rect x="39" y="18" width="22" height="64" rx="3" fill={work.hue} opacity="0.18" />
          <rect x="43" y="24" width="14" height="2" rx="1" fill={work.hue} />
          <rect x="43" y="30" width="10" height="2" rx="1" fill={work.hue} opacity="0.6" />
          <circle cx="50" cy="62" r="6" fill={work.hue} opacity="0.45" />
        </g>
      )}
      {work.pattern === "poster" && (
        <g>
          <rect x="22" y="14" width="56" height="72" rx="2" fill={dim} />
          <path
            d="M30 70 q4 -18 12 -22 q8 -4 14 4 q6 8 14 6"
            stroke={text}
            strokeWidth="2.5"
            fill="none"
            opacity="0.85"
          />
          <circle cx="46" cy="42" r="9" fill={text} opacity="0.9" />
          <rect x="30" y="76" width="26" height="3" rx="1" fill={text} opacity="0.9" />
        </g>
      )}
      {work.pattern === "tablet" && (
        <g>
          <rect x="24" y="14" width="52" height="72" rx="4" fill={text} opacity="0.92" />
          <rect x="28" y="18" width="44" height="64" rx="2" fill={work.hue} opacity="0.18" />
          <rect x="32" y="24" width="20" height="3" rx="1" fill={work.hue} />
          <rect x="32" y="30" width="34" height="2" rx="1" fill={work.hue} opacity="0.6" />
          <rect x="32" y="34" width="28" height="2" rx="1" fill={work.hue} opacity="0.4" />
          <rect x="32" y="46" width="36" height="20" rx="2" fill={work.hue} opacity="0.5" />
        </g>
      )}
      {work.pattern === "browser" && (
        <g>
          <rect x="16" y="22" width="68" height="56" rx="3" fill={text} opacity="0.92" />
          <rect x="16" y="22" width="68" height="8" fill={text} />
          <circle cx="22" cy="26" r="1.4" fill={work.hue} />
          <circle cx="27" cy="26" r="1.4" fill={work.hue} />
          <circle cx="32" cy="26" r="1.4" fill={work.hue} />
          <rect x="20" y="36" width="60" height="38" rx="2" fill={work.hue} opacity="0.2" />
        </g>
      )}
    </svg>
  );
}
