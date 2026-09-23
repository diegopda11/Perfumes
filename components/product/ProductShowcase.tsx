import Image from "next/image";
import type { Product } from "@/types/product";

/**
 * La vitrina del detalle: el frasco completo bajo su propio haz de luz,
 * con el mismo lenguaje del hero.
 */
export function ProductShowcase({ product }: { product: Product }) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-3xl border border-glass-edge bg-surface/50 md:aspect-[4/5] md:max-h-[calc(100svh-8rem)]">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 45% 60% at 50% 0%, color-mix(in oklab, var(--color-glass) 20%, transparent), transparent 80%)",
            "radial-gradient(ellipse 60% 12% at 50% 88%, color-mix(in oklab, var(--color-glass) 12%, transparent), transparent 75%)",
          ].join(","),
        }}
      />
      <div
        aria-hidden
        className="absolute top-0 left-1/2 h-[85%] w-[80%] -translate-x-1/2 blur-[16px]"
        style={{
          clipPath: "polygon(40% 0, 60% 0, 100% 100%, 0 100%)",
          background: "linear-gradient(180deg, color-mix(in oklab, var(--color-glass) 14%, transparent), transparent 90%)",
        }}
      />

      <div className="absolute inset-x-[18%] top-[9%] bottom-[12%]">
        <Image
          src={product.images.bottle}
          alt={`Frasco original de ${product.name} de ${product.brand}`}
          fill
          preload
          sizes="(min-width: 768px) 40vw, 80vw"
          className="object-contain object-bottom"
        />
        {/* reflejo sobre la vitrina */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-full h-full -scale-y-100 opacity-20"
          style={{ maskImage: "linear-gradient(to top, #000 0%, transparent 22%)" }}
        >
          <Image src={product.images.bottle} alt="" fill sizes="40vw" className="object-contain object-bottom" />
        </div>
      </div>
    </div>
  );
}
