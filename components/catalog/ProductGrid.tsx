import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

/**
 * Grilla del catálogo (CA-2.4): 2 columnas en celular; en pantallas grandes,
 * columnas de ancho acotado y centradas, para que 1, 2 o 3 perfumes no
 * queden amontonados a la izquierda y 20+ llenen el ancho.
 */
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-[repeat(auto-fit,minmax(240px,300px))] md:justify-center md:gap-x-8 md:gap-y-14">
      {products.map((product) => (
        <li key={product.slug}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
