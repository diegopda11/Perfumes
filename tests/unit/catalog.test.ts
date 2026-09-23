import { describe, expect, it } from "vitest";
import { mockProducts } from "@/data/mock-products";
import { products } from "@/data/products";
import {
  availableFamilies,
  availableGenders,
  filterProducts,
  getFeatured,
  getRelated,
  parseFilters,
  sortForCatalog,
} from "@/lib/catalog";
import type { Product } from "@/types/product";

const all: Product[] = [...products, ...mockProducts];
const params = (query: string) => new URLSearchParams(query);

describe("sortForCatalog (CA-2.5)", () => {
  it("pone los agotados al final sin perder ninguno", () => {
    const sorted = sortForCatalog(all);
    expect(sorted).toHaveLength(all.length);
    const firstSoldOut = sorted.findIndex((p) => p.available === false);
    expect(firstSoldOut).toBeGreaterThan(-1);
    expect(sorted.slice(firstSoldOut).every((p) => p.available === false)).toBe(true);
  });
});

describe("filtros (CA-2.7 a CA-2.10)", () => {
  it("lee familia y género válidos de la URL", () => {
    expect(parseFilters(params("familia=floral&genero=femenino"))).toEqual({
      familia: "floral",
      genero: "femenino",
    });
  });

  it("ignora valores desconocidos", () => {
    expect(parseFilters(params("familia=plastico&genero=x"))).toEqual({
      familia: undefined,
      genero: undefined,
    });
  });

  it("combina familia y género", () => {
    const result = filterProducts(all, { familia: "floral", genero: "femenino" });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.family === "floral" && p.gender === "femenino")).toBe(true);
  });

  it("sin filtros devuelve todo", () => {
    expect(filterProducts(all, {})).toHaveLength(all.length);
  });

  it("solo ofrece familias y géneros que existen", () => {
    expect(availableFamilies(products)).toEqual(["floral", "chipre", "oriental", "aromatico"]);
    expect(availableGenders(products)).toEqual(["femenino", "masculino"]);
  });
});

describe("getFeatured", () => {
  it("devuelve los destacados del catálogo real", () => {
    expect(getFeatured(products).map((p) => p.slug)).toEqual(products.filter((p) => p.featured).map((p) => p.slug));
  });

  it("si no hay destacados, usa los tres primeros disponibles", () => {
    const plain = mockProducts.map((p) => ({ ...p, featured: false }));
    const featured = getFeatured(plain);
    expect(featured).toHaveLength(3);
    expect(featured.every((p) => p.available !== false)).toBe(true);
  });
});

describe("getRelated (CA-3.6)", () => {
  it("prioriza la misma familia y nunca incluye el propio perfume", () => {
    const libre = products.find((p) => p.slug === "ysl-libre-edp")!;
    const related = getRelated(libre, all);
    expect(related.length).toBeLessThanOrEqual(4);
    expect(related.some((p) => p.slug === libre.slug)).toBe(false);
    expect(related[0].family).toBe("floral");
  });

  it("con pocos perfumes devuelve los que haya", () => {
    const sauvage = products[0];
    const related = getRelated(sauvage, products);
    expect(related).toHaveLength(products.length - 1);
  });
});
