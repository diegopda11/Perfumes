"use client";

import { useEffect, useSyncExternalStore, ViewTransition, type ReactNode } from "react";

/**
 * El frasco que "viaja" de una página a otra (spec 002, P2).
 *
 * El navegador solo puede transformar un elemento en otro si ambos llevan el
 * mismo nombre, y el nombre no puede repetirse en una página. En la portada
 * el mismo perfume aparece dos veces (hero y catálogo), así que un pequeño
 * estado recuerda desde dónde se tocó: ese frasco lleva el nombre y el otro no.
 */
type Source = "hero" | "card";

let source: Source = "card";
const listeners = new Set<() => void>();

export function setBottleSource(next: Source) {
  if (next === source) return;
  source = next;
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  return () => listeners.delete(notify);
}

const getSource = () => source;
const getServerSource = (): Source => "card";

interface Props {
  slug: string;
  role: Source | "detail";
  /** En el hero, solo el frasco al centro puede viajar. */
  active?: boolean;
  children: ReactNode;
}

export function SharedBottle({ slug, role, active = true, children }: Props) {
  const current = useSyncExternalStore(subscribe, getSource, getServerSource);

  // Al llegar al detalle, la vuelta a la portada vuelve a apuntar al catálogo.
  useEffect(() => {
    if (role === "detail") setBottleSource("card");
  }, [role]);

  const named = role === "detail" || (role === current && active);
  if (!named) return <>{children}</>;

  return (
    <ViewTransition name={`bottle-${slug}`} share="bottle-morph" default="none">
      {children}
    </ViewTransition>
  );
}
