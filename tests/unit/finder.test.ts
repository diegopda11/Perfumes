import { describe, expect, it } from "vitest";
import { mockProducts } from "@/data/mock-products";
import { products } from "@/data/products";
import { profileOf, recommend } from "@/lib/finder";

const slugs = (list: { slug: string }[]) => list.map((p) => p.slug);

describe("recommend (CA-P7.1)", () => {
  it("para él, especiado: Sauvage primero", () => {
    expect(recommend(products, { para: "el", momento: "siempre", caracter: "especiado" })[0].slug).toBe(
      "dior-sauvage-edp",
    );
  });

  it("para ella, de noche, cálido: Libre primero", () => {
    expect(recommend(products, { para: "ella", momento: "noche", caracter: "calido" })[0].slug).toBe(
      "ysl-libre-edp",
    );
  });

  it("para ella, de día, fresco: Coco Mademoiselle primero", () => {
    expect(recommend(products, { para: "ella", momento: "dia", caracter: "fresco" })[0].slug).toBe(
      "chanel-coco-mademoiselle-edp",
    );
  });

  it("nunca recomienda un perfume de otro género si se pidió uno", () => {
    const result = recommend(products, { para: "el", momento: "noche", caracter: "floral" });
    expect(slugs(result)).toEqual(["dior-sauvage-edp"]);
  });

  it("'me da igual' considera todo el catálogo y devuelve como máximo 2", () => {
    const result = recommend(products, { para: "cualquiera", momento: "siempre", caracter: "floral" });
    expect(result).toHaveLength(2);
    expect(result.every((p) => p.gender === "femenino")).toBe(true);
  });

  it("no recomienda perfumes agotados", () => {
    const result = recommend(mockProducts, { para: "el", momento: "siempre", caracter: "calido" }, 20);
    expect(result.some((p) => p.available === false)).toBe(false);
  });

  it("los unisex entran tanto para ella como para él", () => {
    const forHim = recommend(mockProducts, { para: "el" }, 20);
    const forHer = recommend(mockProducts, { para: "ella" }, 20);
    const unisex = mockProducts.filter((p) => p.gender === "unisex" && p.available !== false).map((p) => p.slug);
    for (const slug of unisex) {
      expect(slugs(forHim)).toContain(slug);
      expect(slugs(forHer)).toContain(slug);
    }
  });
});

describe("profileOf", () => {
  it("usa el perfil declarado", () => {
    expect(profileOf(products[0]).character).toEqual(["fresco", "especiado"]);
  });

  it("deduce uno por familia cuando falta", () => {
    const mock = mockProducts.find((p) => p.family === "gourmand")!;
    expect(profileOf(mock)).toEqual({ moment: "siempre", character: ["calido"] });
  });
});
