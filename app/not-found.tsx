import Link from "next/link";

/** 404 con la estética de la marca (CA-3.5). */
export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-[80svh] items-center justify-center overflow-hidden px-4 pt-24 pb-16 text-center">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 40% 60% at 50% 0%, color-mix(in oklab, var(--color-glass) 16%, transparent), transparent 80%)",
        }}
      />
      <div>
        <p className="font-display text-[96px] leading-none text-text/15 md:text-[160px]">404</p>
        <h1 className="mt-2 font-display text-[36px] leading-tight md:text-5xl">Este perfume no está en la vitrina</h1>
        <p className="mx-auto mt-4 max-w-[44ch] text-text-muted">
          Puede que el enlace tenga un error o que el perfume ya no esté en el catálogo.
        </p>
        <Link
          href="/#catalogo"
          className="mt-8 inline-flex rounded-full border border-accent-lit/50 px-6 py-3 text-accent-lit transition-colors hover:bg-accent-lit/10"
        >
          Ver la colección
        </Link>
      </div>
    </main>
  );
}
