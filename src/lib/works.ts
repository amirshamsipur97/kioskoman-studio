export type Service = {
  title: string;
  body: string;
  preview?: "list" | "chart" | "progress" | "doc";
};

export type Work = {
  id: string;
  slug: string;
  title: string;
  tag: string;
  /** angle in degrees around the centre (0 = right, 90 = down) */
  angle: number;
  /** radius in viewport-min units (vmin) */
  radius: number;
  /** thumbnail diameter in vmin */
  size: number;
  /** dominant tile colour */
  hue: string;
  /** decorative pattern type for the SVG mock */
  pattern: "browser" | "monitor" | "phone" | "laptop" | "poster" | "tablet";
  /** case-study page copy */
  hero: {
    eyebrow?: string;
    headline: string;
    body: string;
  };
  services: Service[];
};

// Angles / radii / sizes measured directly from the reference site
// screenshot (2004×1344) — see README for the conversion table.
export const WORKS: Work[] = [
  {
    id: "flex",
    slug: "flex",
    title: "Flex Studio",
    tag: "Brand identity",
    angle: 253,
    radius: 42,
    size: 12,
    hue: "#cfe9d2",
    pattern: "poster",
    hero: {
      eyebrow: "Brand",
      headline: "A flexible identity for a moving target.",
      body: "Flex needed a system that could stretch across product, marketing, and field activations without losing its centre. We built it.",
    },
    services: [
      { title: "Identity", body: "Logo, wordmark, and a flexible mark system that bends across surfaces.", preview: "doc" },
      { title: "Type & motion", body: "Custom display type paired with motion principles for every channel.", preview: "chart" },
      { title: "Brand guidelines", body: "Comprehensive guidelines so the team can ship without us in the room.", preview: "list" },
      { title: "Launch site", body: "A launch site that does the talking before the field team arrives.", preview: "doc" },
      { title: "Field activation", body: "Posters, merch, and event kits that survive contact with the real world.", preview: "progress" },
      { title: "Ongoing partner", body: "We stay on as a brand partner — not a vendor on retainer.", preview: "doc" },
    ],
  },
  {
    id: "subjective",
    slug: "subjective",
    title: "Subjective",
    tag: "Web design",
    angle: 296,
    radius: 32,
    size: 12,
    hue: "#f3efe8",
    pattern: "monitor",
    hero: {
      eyebrow: "Web",
      headline: "Subjective — opinionated tools for sharper thinking.",
      body: "A research app that wears its point of view on its sleeve. We shaped the brand and the site to match.",
    },
    services: [
      { title: "Positioning", body: "We sharpened the wedge — who it's for and why it wins.", preview: "doc" },
      { title: "Marketing site", body: "A site that reads like the product feels.", preview: "doc" },
      { title: "Onboarding", body: "First-run UX so the value lands in 30 seconds.", preview: "list" },
      { title: "Pricing page", body: "Pricing that converts without resorting to dark patterns.", preview: "chart" },
      { title: "Docs", body: "Docs the team is actually proud of.", preview: "doc" },
      { title: "Brand kit", body: "Everything the team needs to ship more of the brand without us.", preview: "doc" },
    ],
  },
  {
    id: "control-tower",
    slug: "control-tower",
    title: "Control Tower",
    tag: "Product UI",
    angle: 175,
    radius: 43,
    size: 15,
    hue: "#e9e4d8",
    pattern: "monitor",
    hero: {
      eyebrow: "Product",
      headline: "Control Tower — operations, finally on one runway.",
      body: "A scheduling and ops platform for studios. We designed the IA, the timeline, and every shipped surface.",
    },
    services: [
      { title: "IA & flows", body: "Information architecture that scales beyond the demo data.", preview: "list" },
      { title: "Timeline UI", body: "A dense, drag-friendly timeline as the product centrepiece.", preview: "chart" },
      { title: "Component system", body: "A component library the engineering team owns.", preview: "doc" },
      { title: "Onboarding", body: "First-run flows that convert trial to paid.", preview: "progress" },
      { title: "Settings", body: "Settings that don't feel like an afterthought.", preview: "list" },
      { title: "Telemetry UI", body: "Status, queues, and audit trails — first-class.", preview: "chart" },
    ],
  },
  {
    id: "evergreen",
    slug: "evergreen",
    title: "Evergreen",
    tag: "Web design",
    angle: 210,
    radius: 57,
    size: 19,
    hue: "#dbe6c8",
    pattern: "laptop",
    hero: {
      eyebrow: "Web",
      headline: "Evergreen — climate finance, told plainly.",
      body: "A climate-finance fund needed a site that didn't reach for jargon. We built one that earns trust by reading like a thoughtful letter.",
    },
    services: [
      { title: "Narrative", body: "Long-form site copy structured like a thesis, not a brochure.", preview: "doc" },
      { title: "Editorial", body: "Editorial layouts that hold up at scroll-depth.", preview: "doc" },
      { title: "Data viz", body: "Charts that earn their pixels.", preview: "chart" },
      { title: "Press kit", body: "A press kit reporters actually use.", preview: "doc" },
      { title: "Investor relations", body: "An IR surface that doesn't feel bolted on.", preview: "list" },
      { title: "CMS", body: "A CMS the team can run without engineering.", preview: "doc" },
    ],
  },
  {
    id: "northwind",
    slug: "northwind",
    title: "Northwind",
    tag: "Web design",
    angle: 26,
    radius: 58,
    size: 16,
    hue: "#dbe6c8",
    pattern: "laptop",
    hero: {
      eyebrow: "Web",
      headline: "Northwind — logistics, but legible.",
      body: "Freight is famously opaque. We made a site that explains the product so customers can decide for themselves.",
    },
    services: [
      { title: "Architecture", body: "Site structure based on the buyer's actual questions.", preview: "list" },
      { title: "Pricing model UX", body: "Pricing complexity, made approachable.", preview: "chart" },
      { title: "Track & trace", body: "Tracking interface designed for the loading dock, not the office.", preview: "progress" },
      { title: "Docs portal", body: "API docs and integration guides as a real product surface.", preview: "doc" },
      { title: "Status page", body: "A status page that respects the customer's time.", preview: "list" },
      { title: "Sales tools", body: "Sales enablement that closes deals without us in the loop.", preview: "doc" },
    ],
  },
  {
    id: "hanover-park",
    slug: "hanover-park",
    title: "Hanover Park",
    tag: "Brand & web",
    angle: 75,
    radius: 36,
    size: 13,
    hue: "#efe7da",
    pattern: "monitor",
    hero: {
      eyebrow: "Brand & Web",
      headline: "Hanover Park combines AI-native services with software.",
      body: "Replace multiple broken tools and human duct-tape with Hanover Park. AI agents backed by expert accountants. Get answers, not stale spreadsheets.",
    },
    services: [
      { title: "Fund Administration", body: "Same-day capital calls. AI-reconciled cash. Unified general ledgers connecting every entity.", preview: "list" },
      { title: "Portfolio Intelligence", body: "AI analyzes legal documents and cap tables — grounded in your audited schedule of investments.", preview: "chart" },
      { title: "KPI Collection", body: "AI reconciles values across forms, decks, and emails. Discrepancies surfaced.", preview: "progress" },
      { title: "LP Experience", body: "Investors get instant answers.", preview: "doc" },
      { title: "AI Agents", body: "Delegate to AI via email like a teammate. Transactions reconciled. Evidence automatically collected. Expert services team review.", preview: "doc" },
      { title: "Built for Complexity", body: "Equity pickup. Combination. Consolidation. ILPA reporting. Complex allocation and waterfalls structures.", preview: "doc" },
    ],
  },
  {
    id: "courier",
    slug: "courier",
    title: "Courier",
    tag: "Product UI",
    angle: 1,
    radius: 38,
    size: 14,
    hue: "#c8a988",
    pattern: "phone",
    hero: {
      eyebrow: "Product",
      headline: "Courier — a wallet for everyone who isn't into wallets.",
      body: "A consumer payments app for the moments when crypto fades into the background. We designed every screen.",
    },
    services: [
      { title: "Onboarding", body: "Wallet creation without the jargon.", preview: "progress" },
      { title: "Send & receive", body: "The two flows that have to be perfect.", preview: "doc" },
      { title: "Custody UX", body: "Recovery designed for people, not engineers.", preview: "list" },
      { title: "Activity feed", body: "A feed that doubles as a search interface.", preview: "list" },
      { title: "Settings", body: "Settings that handle 90% of support tickets.", preview: "list" },
      { title: "Brand", body: "A brand that fits in a Lock Screen.", preview: "doc" },
    ],
  },
  {
    id: "atlas",
    slug: "atlas",
    title: "Atlas",
    tag: "Web design",
    angle: 122,
    radius: 32,
    size: 13,
    hue: "#e2dfd6",
    pattern: "monitor",
    hero: {
      eyebrow: "Web",
      headline: "Atlas — climate data, ready for the work.",
      body: "A climate data platform's marketing site. We built one that gets out of the way of the work.",
    },
    services: [
      { title: "Positioning", body: "A wedge that survives contact with skeptics.", preview: "doc" },
      { title: "Site design", body: "Marketing site designed for engineers and procurement, not buzzwords.", preview: "doc" },
      { title: "Data viz", body: "Visuals that respect the precision of the data.", preview: "chart" },
      { title: "Customer stories", body: "Case studies the field team actually sends.", preview: "doc" },
      { title: "Docs", body: "Docs as a marketing surface.", preview: "doc" },
      { title: "CMS", body: "A CMS the team owns end to end.", preview: "doc" },
    ],
  },
];

export function workBySlug(slug: string) {
  return WORKS.find((w) => w.slug === slug);
}
