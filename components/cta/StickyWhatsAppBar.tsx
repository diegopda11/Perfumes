import { getPrice, isAvailable } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";
import { WhatsAppButton } from "./WhatsAppButton";

/** En celular, el botón siempre a mano sin bajar hasta el final (CA-4.3). */
export function StickyWhatsAppBar({ product }: { product: Product }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-glass-edge bg-bg/90 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur-lg md:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p translate="no" className="truncate font-display text-lg leading-tight">{product.name}</p>
          <p className="text-sm text-accent-lit">
            {isAvailable(product) ? formatPrice(getPrice(product)) : "Agotado por ahora"}
          </p>
        </div>
        <WhatsAppButton product={product} size="compact" className="shrink-0" />
      </div>
    </div>
  );
}
