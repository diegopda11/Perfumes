import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { StickyWhatsAppBar } from "@/components/cta/StickyWhatsAppBar";
import { WhatsAppButton } from "@/components/cta/WhatsAppButton";
import { DecantShowcase } from "@/components/product/DecantShowcase";
import { NotesPyramid } from "@/components/product/NotesPyramid";
import { ProductShowcase } from "@/components/product/ProductShowcase";
import { getPrice, getProductBySlug, getProducts, getRelated, isAvailable } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { concentrationLabels, familyLabels, genderLabels } from "@/lib/labels";

// Solo existen los perfumes del catálogo; cualquier otro slug es 404 (CA-3.5).
export const dynamicParams = false;

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/producto/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  const title = `${product.name} de ${product.brand}, decant de 10 ml`;
  const description = `${product.tagline} Decant de 10 ml de perfume original: ${formatPrice(getPrice(product))}.`;
  const ogImage = `/products/${product.slug}/og.jpg`;
  return {
    title,
    description,
    alternates: { canonical: `/producto/${product.slug}` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `/producto/${product.slug}`,
      images: product.isMock ? undefined : [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
  };
}

/** Detalle de producto (HU-3, HU-4). */
export default async function ProductPage(props: PageProps<"/producto/[slug]">) {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const available = isAvailable(product);
  const related = getRelated(product);

  const atmosphere = {
    "--atm-base": product.atmosphere?.base ?? "var(--color-surface)",
    "--atm-glow": product.atmosphere?.glow ?? "var(--color-glass)",
  } as CSSProperties;

  return (
    <main className="relative isolate pb-28 md:pb-0" style={atmosphere}>
      {/* Atmósfera del perfume: la página se tiñe con su color (spec 002, P1) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[170svh]"
        style={{
          background: [
            "radial-gradient(ellipse 70% 45% at 28% 0%, color-mix(in oklab, var(--atm-glow) 20%, transparent), transparent 72%)",
            "linear-gradient(180deg, var(--atm-base) 0%, var(--atm-base) 35%, var(--color-bg) 100%)",
          ].join(","),
        }}
      />
      <article className="mx-auto max-w-[1440px] px-4 pt-20 md:px-10 md:pt-28">
        <nav aria-label="Ruta" className="text-sm text-text-muted">
          <Link href="/#catalogo" className="hover:text-text">
            Colección
          </Link>
          <span aria-hidden className="mx-2">
            /
          </span>
          <span aria-current="page" className="text-text/80">
            {product.name}
          </span>
        </nav>

        <div className="mt-6 grid gap-10 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:gap-14 lg:gap-20">
          <div className="md:sticky md:top-24 md:self-start">
            <ProductShowcase product={product} />
          </div>

          <div className="min-w-0">
            <p translate="no" className="text-text-muted">{product.brand}</p>
            <h1 translate="no" className="mt-1 font-display text-[44px] leading-[1.02] md:text-[64px]">{product.name}</h1>
            <p className="mt-3 text-text-muted">
              {concentrationLabels[product.concentration]}, {familyLabels[product.family].toLowerCase()},{" "}
              {genderLabels[product.gender].toLowerCase()}
            </p>
            {product.perfumer ? (
              <p className="mt-1 text-sm text-text-muted">
                Creado por <span translate="no">{product.perfumer}</span>
                {product.year ? ` en ${product.year}` : ""}.
              </p>
            ) : (
              product.year && <p className="mt-1 text-sm text-text-muted">Lanzado en {product.year}.</p>
            )}
            <p className="mt-6 max-w-[40ch] font-display text-2xl leading-snug text-text/90">{product.tagline}</p>

            <div className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="text-3xl text-accent-lit">{formatPrice(getPrice(product))}</p>
              <p className="text-text-muted">
                {available ? "por un decant de 10 ml" : "Agotado por ahora"}
              </p>
            </div>

            <div className="mt-6 hidden md:block">
              <WhatsAppButton product={product} />
            </div>
            <p className="mt-4 flex items-center gap-2 text-sm text-text-muted">
              <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-accent-lit">
                <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Perfume original, envasado de su frasco auténtico.
            </p>

            <section aria-labelledby="notas-title" className="mt-14">
              <h2 id="notas-title" className="mb-5 font-display text-[30px] leading-tight md:text-4xl">
                Cómo huele
              </h2>
              <NotesPyramid notes={product.notes} />
            </section>

            <section aria-labelledby="perfume-title" className="mt-14">
              <h2 id="perfume-title" className="font-display text-[30px] leading-tight md:text-4xl">
                El perfume
              </h2>
              <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-text/85">{product.description}</p>
              {product.idealFor && (
                <p className="mt-5 max-w-[60ch] leading-relaxed text-text-muted">
                  <span className="text-text">Ideal para: </span>
                  {product.idealFor}
                </p>
              )}
              {product.sources && product.sources.length > 0 && (
                <details className="group mt-6 max-w-[60ch] text-sm text-text-muted">
                  <summary className="cursor-pointer list-none underline decoration-glass-edge underline-offset-4 hover:text-text">
                    Fuentes de esta información
                  </summary>
                  <p className="mt-3">
                    Notas, descripción, perfumista y año según la marca y bases especializadas:
                  </p>
                  <ul className="mt-2 grid gap-1.5">
                    {product.sources.map((source) => (
                      <li key={source.url}>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline decoration-glass-edge underline-offset-4 hover:text-text"
                        >
                          {source.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </section>

            <section aria-label="Lo que recibes" className="mt-14">
              <DecantShowcase product={product} />
            </section>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="relacionados-title" className="mt-24 border-t border-glass-edge">
          <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-10 md:py-24">
            <h2 id="relacionados-title" className="mb-10 font-display text-[32px] leading-tight md:mb-14 md:text-5xl">
              También te puede gustar
            </h2>
            <ProductGrid products={related} />
          </div>
        </section>
      )}

      <StickyWhatsAppBar product={product} />
    </main>
  );
}
