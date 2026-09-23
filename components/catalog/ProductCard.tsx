import Image from "next/image";
import Link from "next/link";
import { getPrice, isAvailable } from "@/lib/catalog";
import { formatList, formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";

/**
 * Tarjeta del catálogo (CA-2.1 a CA-2.5). Toda la tarjeta lleva al detalle;
 * no tiene botón de WhatsApp (CA-2.3).
 */
export function ProductCard({ product, sizes }: { product: Product; sizes?: string }) {
  const available = isAvailable(product);

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group block rounded-2xl focus-visible:outline-offset-4"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-glass-edge bg-surface/60">
        {/* luz de vitrina propia de cada tarjeta */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 55% at 50% 0%, color-mix(in oklab, var(--color-glass) 16%, transparent), transparent 80%)",
          }}
        />

        <span className="absolute top-3 left-3 z-10 rounded-full border border-accent-lit/30 bg-bg/40 px-2.5 py-1 text-[11px] text-accent-lit backdrop-blur-sm md:top-4 md:left-4 md:text-xs">
          100% original
        </span>

        <div
          className={`absolute inset-x-[14%] top-[12%] bottom-[8%] transition-transform duration-500 ease-glide group-hover:-translate-y-1 ${
            available ? "" : "opacity-45 grayscale"
          }`}
        >
          <Image
            src={product.images.bottle}
            alt={`Frasco de ${product.name} de ${product.brand}`}
            fill
            sizes={sizes ?? "(min-width: 1280px) 300px, (min-width: 768px) 30vw, 45vw"}
            className="object-contain object-bottom"
          />
        </div>

        {/* la fracción: el decant que se entrega, junto al frasco */}
        {product.images.decant && (
          <div className="absolute right-[7%] bottom-[8%] h-[30%] w-[12%]">
            <Image
              src={product.images.decant}
              alt=""
              fill
              sizes="60px"
              className={`object-contain object-bottom drop-shadow-[0_0_10px_rgba(235,212,154,0.25)] ${
                available ? "" : "opacity-45 grayscale"
              }`}
            />
          </div>
        )}

        {!available && (
          <span className="absolute inset-x-0 bottom-[42%] z-10 text-center font-display text-2xl text-text">
            Agotado
          </span>
        )}
      </div>

      <div className="mt-4 px-1">
        <p className="text-sm text-text-muted">{product.brand}</p>
        <h3 className="mt-0.5 font-display text-[22px] leading-tight transition-colors group-hover:text-accent-lit md:text-2xl">
          {product.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-text-muted">
          {formatList(product.highlightNotes)}
        </p>
        <p className="mt-2 text-[15px] text-accent-lit">
          {formatPrice(getPrice(product))}
          <span className="ml-1.5 text-sm text-text-muted">por 10 ml</span>
        </p>
      </div>
    </Link>
  );
}
