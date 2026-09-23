/**
 * Sección de catálogo (HU-2). Por ahora solo el encabezado: la grilla y los
 * filtros llegan en la fase 4 (T19-T20).
 */
export function CatalogSection() {
  return (
    <section id="catalogo" aria-labelledby="catalogo-title" className="scroll-mt-6">
      <div className="mx-auto max-w-[1440px] px-4 pt-10 pb-24 md:px-10 md:pt-14">
        <h2 id="catalogo-title" className="font-display text-[40px] leading-[1.05] md:text-[64px]">
          La colección
        </h2>
        <p className="mt-4 max-w-[54ch] text-base leading-relaxed text-text-muted md:text-lg">
          Cada decant se envasa del frasco original: 10 ml para llevar contigo y conocer el
          perfume a fondo antes de comprometerte con el frasco completo.
        </p>
      </div>
    </section>
  );
}
