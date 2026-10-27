"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Presentation, Product } from "@/types/product";

interface SizeState {
  presentations: Product["presentations"];
  selected: Presentation;
  select: (ml: number) => void;
}

const SizeContext = createContext<SizeState | null>(null);

/**
 * Tamaño elegido en el detalle (spec 003, CA-2). Lo comparten el precio, el
 * botón de WhatsApp, la barra fija del celular y "Lo que recibes", para que
 * todos hablen del mismo decant. Empieza en la primera presentación (10 ml).
 */
export function SizeProvider({
  presentations,
  children,
}: {
  presentations: Product["presentations"];
  children: ReactNode;
}) {
  const [ml, setMl] = useState(presentations[0].ml);
  const selected = presentations.find((p) => p.ml === ml) ?? presentations[0];
  return (
    <SizeContext.Provider value={{ presentations, selected, select: setMl }}>{children}</SizeContext.Provider>
  );
}

/** Presentación elegida; fuera del detalle, la primera del perfume. */
export function useSelectedPresentation(product: Pick<Product, "presentations">): Presentation {
  return useContext(SizeContext)?.selected ?? product.presentations[0];
}

export function useSizeChoice(): SizeState | null {
  return useContext(SizeContext);
}

/** Mililitros elegidos, para textos del servidor que deben seguir la elección. */
export function SelectedMl({ product }: { product: Pick<Product, "presentations"> }) {
  return <>{useSelectedPresentation(product).ml}</>;
}
