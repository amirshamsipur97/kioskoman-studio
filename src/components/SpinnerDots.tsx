export function SpinnerDots({ size = 18 }: { size?: number }) {
  const dots = Array.from({ length: 10 });
  const radius = size / 2 - 2;
  return (
    <div
      className="relative inline-block spin-slow"
      style={{ width: size, height: size }}
      aria-hidden
    >
      {dots.map((_, i) => {
        const angle = (i / dots.length) * Math.PI * 2;
        const x = size / 2 + Math.cos(angle) * radius - 1;
        const y = size / 2 + Math.sin(angle) * radius - 1;
        return (
          <span
            key={i}
            className="absolute rounded-full bg-current"
            style={{ left: x, top: y, width: 2, height: 2 }}
          />
        );
      })}
    </div>
  );
}
