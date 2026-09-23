/** Fondo del hero: haz de luz cenital sobre el frasco y penumbra alrededor (CA-1.1). */
export function Spotlight() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* resplandor del foco y peso en la base */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 34% 55% at 50% 0%, color-mix(in oklab, var(--color-glass) 20%, transparent), transparent 75%)",
            "radial-gradient(ellipse 70% 30% at 50% 100%, var(--color-surface), transparent 75%)",
          ].join(","),
        }}
      />
      {/* el haz: un trapecio de luz que cae hasta el frasco */}
      <div
        className="absolute top-0 left-1/2 h-[88%] w-[min(92vw,560px)] -translate-x-1/2 blur-[18px]"
        style={{
          clipPath: "polygon(41% 0, 59% 0, 100% 100%, 0 100%)",
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--color-glass) 16%, transparent), transparent 92%)",
        }}
      />
      {/* reflejo en el piso bajo el frasco */}
      <div
        className="absolute left-1/2 bottom-[16svh] h-10 w-[min(70vw,420px)] -translate-x-1/2 translate-y-1/2 rounded-[50%] md:bottom-[11svh]"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--color-glass) 14%, transparent), transparent)",
        }}
      />
    </div>
  );
}
