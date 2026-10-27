"use client";

import { useId } from "react";
import { formatAmount, formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";
import { useSelectedPresentation, useSizeChoice } from "./SizeContext";
import styles from "./SizeChoice.module.css";

/**
 * Precio del detalle (spec 003, CA-2.1 y CA-2.2): si el perfume se vende en
 * más de un tamaño, primero se elige (10 ml de entrada) y el precio lo sigue.
 */
export function PriceBlock({ product, available }: { product: Product; available: boolean }) {
  const choice = useSizeChoice();
  const selected = useSelectedPresentation(product);
  const name = useId();
  const hasChoice = product.presentations.length > 1 && choice !== null;

  return (
    <div className="mt-8">
      {hasChoice && (
        <fieldset className="mb-5">
          <legend className="mb-3 text-sm text-text-muted">Tamaño del decant</legend>
          <div className="flex flex-wrap gap-3">
            {product.presentations.map((p) => (
              <label key={p.ml} className={styles.option}>
                <input
                  type="radio"
                  name={name}
                  value={p.ml}
                  checked={selected.ml === p.ml}
                  onChange={() => choice.select(p.ml)}
                  className="sr-only"
                />
                {p.ml}&nbsp;ml · {formatAmount(p.price)}
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="text-3xl text-accent-lit" data-testid="precio">
          {formatPrice(selected.price)}
        </p>
        <p className="text-text-muted">{available ? `por un decant de ${selected.ml}\u00a0ml` : "Agotado por ahora"}</p>
      </div>
    </div>
  );
}

/**
 * Precio corto de la barra fija del celular: sigue el tamaño elegido. Con
 * varios tamaños dice cuál ("$90 · 5 ml") y omite "MXN" para caber en una
 * línea junto al botón; el precio completo está arriba.
 */
export function SelectedPriceLabel({ product, available }: { product: Product; available: boolean }) {
  const selected = useSelectedPresentation(product);
  if (!available) return <>Agotado por ahora</>;
  if (product.presentations.length === 1) return <>{formatPrice(selected.price)}</>;
  return (
    <span className="whitespace-nowrap">
      {formatAmount(selected.price)}
      <span className="text-text-muted"> · {selected.ml}&nbsp;ml</span>
    </span>
  );
}
