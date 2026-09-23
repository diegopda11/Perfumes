import { site } from "@/config/site";

const priceFormatter = new Intl.NumberFormat(site.locale, {
  style: "currency",
  currency: site.currency,
  currencyDisplay: "narrowSymbol",
  maximumFractionDigits: 0,
});

/** 390 → "$390 MXN" (RNF-8). */
export function formatPrice(amount: number): string {
  return `${priceFormatter.format(amount)} ${site.currency}`;
}
