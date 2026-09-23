"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  availableFamilies,
  availableGenders,
  filterProducts,
  parseFilters,
  type CatalogFilters,
} from "@/lib/catalog";
import { familyLabels, genderLabels } from "@/lib/labels";
import type { Product } from "@/types/product";
import { ProductGrid } from "./ProductGrid";

/**
 * Filtros por familia y género con estado en la URL (CA-2.7 a CA-2.10),
 * para que un enlace filtrado se pueda compartir.
 */
export function CatalogBrowser({ products }: { products: Product[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = parseFilters(searchParams);

  const families = availableFamilies(products);
  const genders = availableGenders(products);
  const visible = filterProducts(products, filters);
  const hasFilters = Boolean(filters.familia || filters.genero);

  const update = (next: CatalogFilters) => {
    const params = new URLSearchParams();
    if (next.familia) params.set("familia", next.familia);
    if (next.genero) params.set("genero", next.genero);
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}#catalogo`, { scroll: false });
  };

  return (
    <>
      {(families.length > 1 || genders.length > 1) && (
        <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-center md:gap-10">
          {families.length > 1 && (
            <ChipGroup
              label="Familia"
              allLabel="Todas"
              options={families.map((f) => ({ value: f, label: familyLabels[f] }))}
              selected={filters.familia}
              onSelect={(familia) => update({ ...filters, familia })}
            />
          )}
          {genders.length > 1 && (
            <ChipGroup
              label="Para"
              allLabel="Todos"
              options={genders.map((g) => ({ value: g, label: genderLabels[g] }))}
              selected={filters.genero}
              onSelect={(genero) => update({ ...filters, genero })}
            />
          )}
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {visible.length === 1 ? "1 perfume" : `${visible.length} perfumes`}
      </p>

      {visible.length > 0 ? (
        <ProductGrid products={visible} />
      ) : (
        <div className="rounded-2xl border border-glass-edge px-6 py-14 text-center">
          <p className="font-display text-2xl">Ningún perfume coincide con esos filtros</p>
          <p className="mt-2 text-text-muted">Prueba con otra familia o quita los filtros para ver toda la colección.</p>
          {hasFilters && (
            <button
              type="button"
              onClick={() => update({})}
              className="mt-6 rounded-full border border-accent-lit/50 px-5 py-2.5 text-accent-lit transition-colors hover:bg-accent-lit/10"
            >
              Quitar filtros
            </button>
          )}
        </div>
      )}
    </>
  );
}

interface ChipGroupProps<T extends string> {
  label: string;
  allLabel: string;
  options: { value: T; label: string }[];
  selected: T | undefined;
  onSelect: (value: T | undefined) => void;
}

function ChipGroup<T extends string>({ label, allLabel, options, selected, onSelect }: ChipGroupProps<T>) {
  const chips: { value: T | undefined; label: string }[] = [{ value: undefined, label: allLabel }, ...options];
  return (
    <div role="group" aria-label={label} className="flex min-w-0 items-center gap-3">
      <span className="shrink-0 text-sm text-text-muted">{label}</span>
      <div className="-my-1 flex gap-2 overflow-x-auto py-1 [scrollbar-width:none]">
        {chips.map((chip) => {
          const pressed = chip.value === selected;
          return (
            <button
              key={chip.label}
              type="button"
              aria-pressed={pressed}
              onClick={() => onSelect(chip.value)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-[color,background-color,border-color,scale] active:scale-[0.97] ${
                pressed
                  ? "border-accent-lit/70 bg-accent-lit/10 text-accent-lit"
                  : "border-glass-edge text-text/80 hover:border-text/40 hover:text-text"
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
