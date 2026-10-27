import { site } from "@/config/site";

const priceFormatter = new Intl.NumberFormat(site.locale, {
  style: "currency",
  currency: site.currency,
  currencyDisplay: "narrowSymbol",
  maximumFractionDigits: 0,
});

/** 390 → "$390": solo la cantidad, para listas que llevan la moneda una vez. */
export function formatAmount(amount: number): string {
  return priceFormatter.format(amount);
}

/** 390 → "$390 MXN" (RNF-8). El espacio no se corta al cambiar de línea. */
export function formatPrice(amount: number): string {
  return `${formatAmount(amount)}\u00a0${site.currency}`;
}

const listFormatter = new Intl.ListFormat("es", { style: "long", type: "conjunction" });

/** ["Rosa", "Oud", "Ámbar"] → "Rosa, Oud y Ámbar". */
export function formatList(items: readonly string[]): string {
  return listFormatter.format(items);
}
