import { products } from "@/data/products";
import type { Product } from "@/types/product";

export function getProducts(): Product[] {
  return products;
}

export function isAvailable(product: Product): boolean {
  return product.available !== false;
}

/**
 * Perfumes del carrusel del hero. Si ninguno está marcado como destacado,
 * se usan los tres primeros disponibles (plan §5).
 */
export function getFeatured(): Product[] {
  const all = getProducts();
  const featured = all.filter((p) => p.featured);
  return featured.length > 0 ? featured : all.filter(isAvailable).slice(0, 3);
}

export function getPrice(product: Product): number {
  return product.presentations[0].price;
}
