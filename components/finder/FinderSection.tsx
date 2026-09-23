import { getProducts } from "@/lib/catalog";
import { ScentFinder } from "./ScentFinder";

/** Sección "Encuentra tu perfume" en la portada (spec 002, P7). */
export function FinderSection() {
  return (
    <section
      id="encuentra"
      aria-labelledby="encuentra-title"
      className="scroll-mt-6 border-t border-glass-edge"
    >
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-4 py-20 md:grid-cols-[1fr_1.3fr] md:gap-16 md:px-10 md:py-28">
        <div>
          <h2
            id="encuentra-title"
            className="font-display text-[36px] leading-[1.05] md:text-[52px]"
          >
            Encuentra tu perfume
          </h2>
          <p className="mt-4 max-w-[40ch] text-lg leading-relaxed text-text-muted">
            ¿No sabes por dónde empezar? Responde tres preguntas y te decimos
            cuál probar primero.
          </p>
        </div>
        <ScentFinder products={getProducts()} />
      </div>
    </section>
  );
}
