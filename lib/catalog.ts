import { mockProducts } from "@/data/mock-products";
import { products } from "@/data/products";
import { familyLabels, genderLabels } from "@/lib/labels";
import type { Gender, OlfactoryFamily, Product } from "@/types/product";

/** Catálogo completo. Los ficticios solo entran si se piden explícitamente (plan §3). */
export function getProducts(): Product[] {
  const includeMocks = process.env.NEXT_PUBLIC_INCLUDE_MOCKS === "true";
  return includeMocks ? [...products, ...mockProducts] : products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProducts().find((p) => p.slug === slug);
}

export function isAvailable(product: Product): boolean {
  return product.available !== false;
}

export function getPrice(product: Product): number {
  return product.presentations[0].price;
}

/** "Sauvage de Dior": cómo se nombra un perfume en mensajes y textos. */
export function displayName(product: Product): string {
  return `${product.name} de ${product.brand}`;
}

/**
 * Perfumes del carrusel del hero. Si ninguno está marcado como destacado,
 * se usan los tres primeros disponibles (plan §5).
 */
export function getFeatured(all: Product[] = getProducts()): Product[] {
  const featured = all.filter((p) => p.featured && isAvailable(p));
  return featured.length > 0 ? featured : all.filter(isAvailable).slice(0, 3);
}

/** Orden de la grilla: disponibles primero, agotados al final (CA-2.5). */
export function sortForCatalog(list: Product[]): Product[] {
  return [...list].sort((a, b) => Number(!isAvailable(a)) - Number(!isAvailable(b)));
}

// ---------- Filtros (CA-2.7 a CA-2.10) ----------

export interface CatalogFilters {
  familia?: OlfactoryFamily;
  genero?: Gender;
}

function isFamily(value: unknown): value is OlfactoryFamily {
  return typeof value === "string" && value in familyLabels;
}

function isGender(value: unknown): value is Gender {
  return typeof value === "string" && value in genderLabels;
}

/** Lee los filtros de la URL; ignora valores desconocidos en vez de fallar. */
export function parseFilters(params: { get(name: string): string | null }): CatalogFilters {
  const familia = params.get("familia");
  const genero = params.get("genero");
  return {
    familia: isFamily(familia) ? familia : undefined,
    genero: isGender(genero) ? genero : undefined,
  };
}

export function filterProducts(list: Product[], filters: CatalogFilters): Product[] {
  return list.filter(
    (p) =>
      (!filters.familia || p.family === filters.familia) &&
      (!filters.genero || p.gender === filters.genero),
  );
}

/** Solo las familias presentes en el catálogo, en el orden canónico (CA-2.10). */
export function availableFamilies(list: Product[]): OlfactoryFamily[] {
  const present = new Set(list.map((p) => p.family));
  return (Object.keys(familyLabels) as OlfactoryFamily[]).filter((f) => present.has(f));
}

export function availableGenders(list: Product[]): Gender[] {
  const present = new Set(list.map((p) => p.gender));
  return (Object.keys(genderLabels) as Gender[]).filter((g) => present.has(g));
}

// ---------- Relacionados (CA-3.6) ----------

/**
 * Hasta `max` perfumes para seguir explorando: primero la misma familia,
 * luego la misma marca, luego los destacados y al final el resto.
 */
export function getRelated(product: Product, all: Product[] = getProducts(), max = 4): Product[] {
  const others = all.filter((p) => p.slug !== product.slug);
  const tiers = [
    others.filter((p) => p.family === product.family),
    others.filter((p) => p.brand === product.brand),
    others.filter((p) => p.featured),
    others,
  ];
  const picked: Product[] = [];
  for (const tier of tiers) {
    for (const p of sortForCatalog(tier)) {
      if (picked.length === max) return picked;
      if (!picked.includes(p)) picked.push(p);
    }
  }
  return picked;
}
