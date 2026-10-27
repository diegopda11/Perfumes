import { SelectedPriceLabel } from "@/components/product/PriceBlock";
import { isAvailable } from "@/lib/catalog";
import type { Product } from "@/types/product";
import { WhatsAppButton } from "./WhatsAppButton";

/**
 * En celular, el botón siempre a mano sin bajar hasta el final (CA-4.3).
 * Usa el mismo tamaño elegido arriba (spec 003, CA-2.4).
 */
export function StickyWhatsAppBar({ product }: { product: Product }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-glass-edge bg-bg/90 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur-lg md:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p translate="no" className="truncate font-display text-lg leading-tight">{product.name}</p>
          <p className="text-sm text-accent-lit">
            <SelectedPriceLabel product={product} available={isAvailable(product)} />
          </p>
        </div>
        <WhatsAppButton product={product} size="compact" className="shrink-0" />
      </div>
    </div>
  );
}
