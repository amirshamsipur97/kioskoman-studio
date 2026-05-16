import { Work } from "@/lib/works";

/**
 * Decorative scene shown inside each circular thumbnail.
 * Mocks "product-shot on a desk" feeling: warm backdrop, soft shading,
 * device + screen content rendered in SVG so the orbit reads as photos
 * from a distance.
 */
export function MockThumb({ work }: { work: Work }) {
  if (work.pattern === "label") {
    const text = (work.label ?? work.title).toUpperCase();
    // Auto-fit font size to the label length so longer phrases stay readable
    const fontSize = text.length <= 12 ? 7 : text.length <= 18 ? 5.5 : 4.5;
    return (
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <rect width="100" height="100" fill="#0a0a0a" />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#ffffff"
          fontFamily="var(--font-geist-sans), system-ui, sans-serif"
          fontWeight={500}
          fontSize={fontSize}
          letterSpacing="0.35"
        >
          {text}
        </text>
      </svg>
    );
  }

  const isDark = work.hue.startsWith("#1") || work.hue.startsWith("#2");
  const ink = isDark ? "#f1ece4" : "#0a0a0a";
  const screen = isDark ? "#0d130f" : "#1b1f24";

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full pointer-events-none"
    >
      <defs>
        <radialGradient id={`bg-${work.id}`} cx="50%" cy="38%" r="70%">
          <stop offset="0%" stopColor={lighten(work.hue, 0.08)} />
          <stop offset="60%" stopColor={work.hue} />
          <stop offset="100%" stopColor={darken(work.hue, 0.12)} />
        </radialGradient>
        <linearGradient id={`floor-${work.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={darken(work.hue, 0.02)} stopOpacity="0" />
          <stop offset="100%" stopColor={darken(work.hue, 0.22)} stopOpacity="0.55" />
        </linearGradient>
      </defs>

      <rect width="100" height="100" fill={`url(#bg-${work.id})`} />
      <rect y="70" width="100" height="30" fill={`url(#floor-${work.id})`} />

      {work.pattern === "monitor" && (
        <g>
          <ellipse cx="50" cy="86" rx="34" ry="3" fill="#000" opacity="0.18" />
          <rect x="22" y="74" width="56" height="3" rx="1" fill={darken(work.hue, 0.18)} />
          <rect x="44" y="64" width="12" height="12" fill={darken(work.hue, 0.2)} />
          <rect x="8" y="20" width="84" height="48" rx="3" fill="#101418" />
          <rect x="12" y="24" width="76" height="40" rx="2" fill={screen} />
          <rect x="16" y="28" width="22" height="2.2" rx="1" fill={ink} opacity="0.85" />
          <rect x="16" y="33" width="36" height="2" rx="1" fill={ink} opacity="0.55" />
          <rect x="16" y="37" width="28" height="2" rx="1" fill={ink} opacity="0.35" />
          <rect x="16" y="46" width="64" height="14" rx="2" fill={ink} opacity="0.1" />
          <rect x="20" y="50" width="14" height="2" rx="1" fill={ink} opacity="0.55" />
          <rect x="20" y="54" width="22" height="2" rx="1" fill={ink} opacity="0.35" />
        </g>
      )}

      {work.pattern === "laptop" && (
        <g>
          <ellipse cx="50" cy="80" rx="42" ry="3" fill="#000" opacity="0.18" />
          <path d="M14 30 H86 V70 H14 Z" fill="#0e1116" />
          <rect x="17" y="33" width="66" height="34" rx="2" fill={screen} />
          <path d="M8 70 H92 L86 78 H14 Z" fill="#1a1f25" />
          <path d="M40 70 H60 V73 H40 Z" fill="#0a0d11" />
          <circle cx="32" cy="46" r="5" fill={ink} opacity="0.18" />
          <rect x="42" y="44" width="26" height="2.4" rx="1" fill={ink} opacity="0.7" />
          <rect x="42" y="49" width="20" height="2" rx="1" fill={ink} opacity="0.45" />
          <rect x="42" y="53" width="14" height="2" rx="1" fill={ink} opacity="0.3" />
        </g>
      )}

      {work.pattern === "phone" && (
        <g>
          <ellipse cx="50" cy="85" rx="30" ry="2.4" fill="#000" opacity="0.16" />
          <rect x="34" y="12" width="32" height="72" rx="6" fill="#0e1116" />
          <rect x="36.5" y="14.5" width="27" height="67" rx="4.5" fill={screen} />
          <rect x="44" y="20" width="12" height="1.6" rx="0.8" fill={ink} opacity="0.6" />
          <rect x="40" y="26" width="20" height="2.2" rx="1" fill={ink} opacity="0.85" />
          <rect x="40" y="30" width="14" height="2" rx="1" fill={ink} opacity="0.55" />
          <rect x="40" y="38" width="20" height="14" rx="2" fill={ink} opacity="0.1" />
          <circle cx="50" cy="68" r="5" fill={ink} opacity="0.2" />
        </g>
      )}

      {work.pattern === "poster" && (
        <g>
          <ellipse cx="50" cy="86" rx="36" ry="3" fill="#000" opacity="0.16" />
          <rect x="18" y="8" width="64" height="78" rx="1" fill={lighten(work.hue, 0.08)} />
          <path d="M18 8 V 86 L 38 86 V 22 Z" fill={darken(work.hue, 0.05)} opacity="0.5" />
          <path
            d="M28 70 q4 -22 14 -26 q10 -4 14 6 q3 8 12 6 q8 -2 12 4"
            stroke={ink}
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />
          <circle cx="44" cy="38" r="9" fill={ink} opacity="0.92" />
          <circle cx="48" cy="36" r="2" fill={lighten(work.hue, 0.06)} />
          <rect x="26" y="76" width="22" height="2.4" rx="1" fill={ink} opacity="0.88" />
        </g>
      )}

      {work.pattern === "tablet" && (
        <g>
          <ellipse cx="50" cy="88" rx="34" ry="2.4" fill="#000" opacity="0.16" />
          <rect x="22" y="12" width="56" height="72" rx="5" fill="#0e1116" />
          <rect x="25" y="15" width="50" height="66" rx="3" fill={screen} />
          <rect x="30" y="22" width="22" height="2.4" rx="1" fill={ink} opacity="0.85" />
          <rect x="30" y="28" width="36" height="2" rx="1" fill={ink} opacity="0.55" />
          <rect x="30" y="32" width="28" height="2" rx="1" fill={ink} opacity="0.35" />
          <rect x="30" y="44" width="40" height="24" rx="2" fill={ink} opacity="0.12" />
        </g>
      )}

      {work.pattern === "browser" && (
        <g>
          <ellipse cx="50" cy="88" rx="34" ry="2.4" fill="#000" opacity="0.14" />
          <rect x="12" y="20" width="76" height="62" rx="3" fill="#0e1116" />
          <rect x="12" y="20" width="76" height="9" fill="#1a1f25" />
          <circle cx="18" cy="24.5" r="1.4" fill={lighten(work.hue, 0.06)} />
          <circle cx="23" cy="24.5" r="1.4" fill={lighten(work.hue, 0.06)} />
          <circle cx="28" cy="24.5" r="1.4" fill={lighten(work.hue, 0.06)} />
          <rect x="16" y="34" width="68" height="44" rx="2" fill={screen} />
          <rect x="20" y="40" width="22" height="2.4" rx="1" fill={ink} opacity="0.85" />
          <rect x="20" y="45" width="36" height="2" rx="1" fill={ink} opacity="0.55" />
          <rect x="20" y="55" width="58" height="18" rx="2" fill={ink} opacity="0.1" />
        </g>
      )}

      <rect width="100" height="100" fill="url(#sheen)" />
      <defs>
        <radialGradient id="sheen" cx="30%" cy="20%" r="40%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function clamp(n: number, min = 0, max = 255) {
  return Math.max(min, Math.min(max, n));
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function toHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((c) => clamp(Math.round(c)).toString(16).padStart(2, "0"))
    .join("")}`;
}

function lighten(hex: string, amount: number) {
  const [r, g, b] = hexToRgb(hex);
  return toHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount);
}

function darken(hex: string, amount: number) {
  const [r, g, b] = hexToRgb(hex);
  return toHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}
