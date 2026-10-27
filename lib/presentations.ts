import { site } from "@/config/site";
import { formatAmount, formatPrice } from "@/lib/format";
import type { Presentation, Product } from "@/types/product";

type Presentations = Product["presentations"];

/**
 * Cómo se convierten los precios que edita el dueño en tamaños (spec 003):
 * `price` es el decant de 10 ml y `price5ml`, si está, agrega el de 5 ml.
 * Si el perfume trae `presentations` escrito a mano, eso manda.
 */
export function toPresentations({
  price,
  price5ml,
  presentations,
}: {
  price: number;
  price5ml?: number;
  presentations?: Presentations;
}): Presentations {
  if (presentations) return presentations;
  const list: Presentations = [{ ml: 10, price }];
  if (price5ml !== undefined) list.push({ ml: 5, price: price5ml });
  return list;
}

/**
 * [10, 5] → "5 y 10 ml"; con "o" → "5 o 10 ml". De menor a mayor, sin repetir;
 * el espacio antes de "ml" no se corta, como en el resto del sitio.
 */
export function formatSizes(mls: readonly number[], joiner: "y" | "o" = "y"): string {
  const unique = [...new Set(mls)].sort((a, b) => a - b);
  if (unique.length <= 1) return `${unique[0] ?? site.defaultSize}\u00a0ml`;
  return `${unique.slice(0, -1).join(", ")} ${joiner} ${unique[unique.length - 1]}\u00a0ml`;
}

/**
 * Partes del precio compacto, cada una sin cortes por dentro: una sola
 * presentación queda como siempre (["$220 MXN"]); varias,
 * ["10 ml $220", "5 ml $130 MXN"] (la moneda va una vez, al final).
 */
export function priceListParts(presentations: readonly Presentation[]): string[] {
  if (presentations.length === 1) return [formatPrice(presentations[0].price)];
  const parts = presentations.map((p) => `${p.ml}\u00a0ml\u00a0${formatAmount(p.price)}`);
  parts[parts.length - 1] += `\u00a0${site.currency}`;
  return parts;
}

/** Precio compacto en una línea: "10 ml $220 · 5 ml $130 MXN" (metadatos, textos). */
export function formatPriceList(presentations: readonly Presentation[]): string {
  return priceListParts(presentations).join(" · ");
}

/** Todos los tamaños que se venden en el catálogo, de menor a mayor. */
export function catalogSizes(list: readonly Pick<Product, "presentations">[]): number[] {
  const mls = new Set(list.flatMap((p) => p.presentations.map((pr) => pr.ml)));
  return [...mls].sort((a, b) => a - b);
}
