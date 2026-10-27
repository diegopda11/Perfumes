import Image from "next/image";
import { formatSizes } from "@/lib/presentations";
import type { Product } from "@/types/product";
import { SelectedMl } from "./SizeContext";

/**
 * "Lo que recibes" (CA-3.2, CA-3.4): deja claro que se entrega un decant
 * (del tamaño elegido, spec 003), no el frasco completo. Muestra la escena
 * con los dos juntos para que se vea la proporción.
 */
export function DecantShowcase({ product }: { product: Product }) {
  const image = product.images.scene ?? product.images.decant;
  const isScene = Boolean(product.images.scene);
  const sizes = product.presentations.map((p) => p.ml);
  const hasChoice = sizes.length > 1;

  return (
    <div className="grid items-center gap-8 rounded-3xl border border-glass-edge bg-surface/40 p-5 sm:grid-cols-[minmax(0,260px)_1fr] sm:p-8">
      {image &&
        (isScene ? (
          // La escena conserva su proporción (vertical o cuadrada): nunca se
          // recorta, para que el decant siempre se vea completo junto al frasco.
          <Image
            src={image}
            alt={`Frasco original de ${product.name} junto a su decant`}
            width={600}
            height={1200}
            sizes="260px"
            className="mx-auto h-auto max-h-[420px] w-auto max-w-full rounded-2xl"
          />
        ) : (
          <div className="relative mx-auto aspect-[1/2] w-full max-w-[220px] overflow-hidden rounded-2xl bg-bg/40">
            <Image
              src={image}
              alt={`Decant de ${product.name}`}
              fill
              sizes="220px"
              className="object-contain p-6"
            />
          </div>
        ))}
      <div>
        <h2 className="font-display text-[30px] leading-tight md:text-4xl">Lo que recibes</h2>
        <p className="mt-3 max-w-[48ch] leading-relaxed text-text-muted">
          Un decant de <SelectedMl product={product} />&nbsp;ml de {product.name}, envasado del frasco
          original de {product.brand} en un atomizador de vidrio. No es el frasco completo: es una
          fracción para usarlo, conocerlo y llevarlo contigo.
          {hasChoice && ` Lo tenemos en ${formatSizes(sizes)}.`}
        </p>
        <ul className="mt-6 grid gap-3 text-[15px]">
          {[
            <>
              <SelectedMl product={product} />&nbsp;ml del perfume original
            </>,
            "Atomizador de vidrio con tapa, cabe en cualquier bolsillo",
            "Pago y entrega en persona",
          ].map((item, i) => (
            <li key={i} className="flex gap-3">
              <span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-lit" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
