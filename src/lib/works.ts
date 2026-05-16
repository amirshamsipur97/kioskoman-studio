export type Work = {
  id: string;
  title: string;
  tag: string;
  /** angle in degrees around the centre (0 = right, 90 = down) */
  angle: number;
  /** radius in viewport-min units (vmin) */
  radius: number;
  /** thumbnail diameter in vmin */
  size: number;
  /** subtle color shown on the thumbnail */
  hue: string;
  /** decorative pattern type for the SVG mock */
  pattern: "browser" | "monitor" | "phone" | "laptop" | "poster" | "tablet";
};

export const WORKS: Work[] = [
  {
    id: "flex",
    title: "Flex Studio",
    tag: "Brand identity",
    angle: 250,
    radius: 30,
    size: 11,
    hue: "#cfe9d2",
    pattern: "poster",
  },
  {
    id: "subjective",
    title: "Subjective",
    tag: "Web design",
    angle: 290,
    radius: 28,
    size: 10,
    hue: "#f3efe8",
    pattern: "monitor",
  },
  {
    id: "control-tower",
    title: "Control Tower",
    tag: "Product UI",
    angle: 0,
    radius: 32,
    size: 13,
    hue: "#e9e4d8",
    pattern: "monitor",
  },
  {
    id: "evergreen",
    title: "Evergreen",
    tag: "Web design",
    angle: 50,
    radius: 30,
    size: 12,
    hue: "#dbe6c8",
    pattern: "laptop",
  },
  {
    id: "northwind",
    title: "Northwind",
    tag: "Web design",
    angle: 95,
    radius: 28,
    size: 9,
    hue: "#1a1f1a",
    pattern: "tablet",
  },
  {
    id: "harbor",
    title: "Harbor",
    tag: "Brand identity",
    angle: 140,
    radius: 32,
    size: 12,
    hue: "#efe7da",
    pattern: "monitor",
  },
  {
    id: "courier",
    title: "Courier",
    tag: "Product UI",
    angle: 200,
    radius: 30,
    size: 11,
    hue: "#1e2a23",
    pattern: "phone",
  },
  {
    id: "atlas",
    title: "Atlas",
    tag: "Web design",
    angle: 220,
    radius: 26,
    size: 10,
    hue: "#e2dfd6",
    pattern: "laptop",
  },
];
