import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { mockProducts } from "@/data/mock-products";
import { products } from "@/data/products";

/**
 * Validación de los datos del catálogo (plan §3). Si el dueño agrega un
 * perfume con un error, esta prueba lo dice antes de publicar.
 */
const publicDir = join(process.cwd(), "public");

describe.each([
  ["catálogo real", products],
  ["catálogo ficticio", mockProducts],
])("%s", (_, list) => {
  it("tiene slugs únicos y válidos para una URL", () => {
    const slugs = list.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it.each(list.map((p) => [p.slug, p] as const))("%s: datos completos", (_slug, p) => {
    expect(p.name.trim()).not.toBe("");
    expect(p.brand.trim()).not.toBe("");
    expect(p.tagline.trim()).not.toBe("");
    expect(p.highlightNotes.length).toBeGreaterThanOrEqual(2);
    expect(p.highlightNotes.length).toBeLessThanOrEqual(3);
    expect(p.notes.top.length).toBeGreaterThan(0);
    expect(p.notes.heart.length).toBeGreaterThan(0);
    expect(p.notes.base.length).toBeGreaterThan(0);
    for (const presentation of p.presentations) {
      expect(presentation.ml).toBeGreaterThan(0);
      expect(Number.isInteger(presentation.price)).toBe(true);
      expect(presentation.price).toBeGreaterThan(0);
    }
  });

  it.each(list.map((p) => [p.slug, p] as const))("%s: sus imágenes existen", (_slug, p) => {
    for (const src of Object.values(p.images)) {
      if (src) expect(existsSync(join(publicDir, src)), src).toBe(true);
    }
  });
});

it("ningún perfume real está marcado como ficticio", () => {
  expect(products.some((p) => p.isMock)).toBe(false);
});
