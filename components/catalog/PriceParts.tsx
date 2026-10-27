import { priceListParts } from "@/lib/presentations";
import type { Presentation } from "@/types/product";

/**
 * Precios de todos los tamaños (spec 003, CA-3): en pantallas angostas el
 * renglón solo se corta entre un tamaño y otro, nunca dentro de uno.
 */
export function PriceParts({ presentations }: { presentations: readonly Presentation[] }) {
  return priceListParts(presentations).map((part, i) => (
    <span key={part}>
      {i > 0 && " · "}
      <span className="whitespace-nowrap">{part}</span>
    </span>
  ));
}
