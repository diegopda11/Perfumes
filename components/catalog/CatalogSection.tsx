import { Suspense } from "react";
import { getProducts, sortForCatalog } from "@/lib/catalog";
import { CatalogBrowser } from "./CatalogBrowser";
import { ProductGrid } from "./ProductGrid";

/** Sección de catálogo en la home (HU-2). */
export function CatalogSection() {
  const products = sortForCatalog(getProducts());

  return (
    <section id="catalogo" aria-labelledby="catalogo-title" className="scroll-mt-6">
      <div className="mx-auto max-w-[1440px] px-4 pt-10 pb-24 md:px-10 md:pt-14 md:pb-32">
        <h2 id="catalogo-title" className="font-display text-[40px] leading-[1.05] md:text-[64px]">
          La colección
        </h2>
        <p className="mt-4 mb-10 max-w-[54ch] text-base leading-relaxed text-text-muted md:mb-14 md:text-lg">
          Cada decant se envasa del frasco original: 10 ml para llevar contigo y conocer el
          perfume a fondo antes de comprometerte con el frasco completo.
        </p>

        {/* Los filtros leen la URL en el navegador; mientras tanto, la grilla completa */}
        <Suspense fallback={<ProductGrid products={products} />}>
          <CatalogBrowser products={products} />
        </Suspense>
      </div>
    </section>
  );
}
