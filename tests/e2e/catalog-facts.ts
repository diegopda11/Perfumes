import { filterProducts, getFeatured, getProducts, getRelated } from "@/lib/catalog";
import { familyLabels, genderLabels } from "@/lib/labels";
import type { Gender, OlfactoryFamily } from "@/types/product";

/**
 * Valores que las pruebas e2e calculan desde el catálogo en vez de fijarlos
 * a mano: así agregar o quitar perfumes no rompe las pruebas.
 */
const products = getProducts();

export const total = products.length;

/** Un perfume real para pruebas de detalle: el primero del catálogo. */
export const sample = products[0];
/** Otro perfume real (el último del catálogo), para pruebas que navegan desde el catálogo. */
export const other = products[products.length - 1];
/** El primer perfume del carrusel (el que se ve al abrir la portada). */
export const firstFeatured = getFeatured(products)[0];
export const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
