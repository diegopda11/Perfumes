import { filterProducts, getFeatured, getProducts, getRelated } from "@/lib/catalog";
import { familyLabels, genderLabels } from "@/lib/labels";
import type { Gender, OlfactoryFamily } from "@/types/product";

/**
 * Valores que las pruebas e2e calculan desde el catálogo en vez de fijarlos
 * a mano: así agregar o quitar perfumes no rompe las pruebas.
 */
const products = getProducts();

export const total = products.length;
export const featuredCount = getFeatured(products).length;
export const position = (n: number) => `${n} de ${featuredCount}`;
export const femeninoCount = products.filter((p) => p.gender === "femenino").length;

export function relatedCount(slug: string): number {
  const product = products.find((p) => p.slug === slug)!;
  return getRelated(product, products).length;
}

/** Una combinación de filtros válida que no tiene ningún perfume (para el estado vacío). */
export function emptyFilterQuery(): string {
  for (const familia of Object.keys(familyLabels) as OlfactoryFamily[]) {
    for (const genero of Object.keys(genderLabels) as Gender[]) {
      if (filterProducts(products, { familia, genero }).length === 0) {
        return `?familia=${familia}&genero=${genero}`;
      }
    }
  }
  throw new Error("Todas las combinaciones de filtros tienen perfumes");
}
