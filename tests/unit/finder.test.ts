import { describe, expect, it } from "vitest";
import { mockProducts } from "@/data/mock-products";
import { products } from "@/data/products";
import { profileOf, recommend } from "@/lib/finder";
import type { Product, ScentProfile } from "@/types/product";

/**
 * Perfumes de prueba propios: la lógica se prueba con datos fijos, así que
 * agregar o quitar perfumes del catálogo no cambia estos resultados.
 */
function perfume(slug: string, gender: Product["gender"], profile: ScentProfile, available = true): Product {
  return {
    slug,
    name: slug,
    brand: "Prueba",
    concentration: "EDP",
    family: "floral",
    gender,
    tagline: "",
    description: "",
    highlightNotes: ["a", "b"],
    notes: { top: ["a"], heart: ["b"], base: ["c"] },
    presentations: [{ ml: 10, price: 100 }],
    images: { bottle: "" },
    profile,
    available,
  };
}

const fixture: Product[] = [
  perfume("fresco-especiado-el", "masculino", { moment: "siempre", character: ["fresco", "especiado"] }),
  perfume("floral-fresco-ella", "femenino", { moment: "siempre", character: ["floral", "fresco"] }),
  perfume("floral-calido-ella-noche", "femenino", { moment: "noche", character: ["floral", "calido"] }),
  perfume("calido-especiado-el-noche", "masculino", { moment: "noche", character: ["calido", "especiado"] }),
  perfume("agotado-el", "masculino", { moment: "noche", character: ["calido"] }, false),
];

const slugs = (list: { slug: string }[]) => list.map((p) => p.slug);

describe("recommend (CA-P7.1)", () => {
  it("para él, a toda hora, especiado: el especiado de todo momento primero", () => {
    expect(recommend(fixture, { para: "el", momento: "siempre", caracter: "especiado" })[0].slug).toBe(
      "fresco-especiado-el",
    );
  });

  it("para ella, de noche, cálido: el floral cálido de noche primero", () => {
    expect(recommend(fixture, { para: "ella", momento: "noche", caracter: "calido" })[0].slug).toBe(
      "floral-calido-ella-noche",
    );
  });

  it("para ella, de día, fresco: el floral fresco primero", () => {
    expect(recommend(fixture, { para: "ella", momento: "dia", caracter: "fresco" })[0].slug).toBe(
      "floral-fresco-ella",
    );
  });

  it("para él, de noche, cálido: el cálido de noche primero", () => {
    expect(recommend(fixture, { para: "el", momento: "noche", caracter: "calido" })[0].slug).toBe(
      "calido-especiado-el-noche",
    );
  });

  it("nunca recomienda un perfume de otro género si se pidió uno", () => {
    const result = recommend(fixture, { para: "el", momento: "noche", caracter: "floral" });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.gender === "masculino")).toBe(true);
  });

  it("'me da igual' considera todo el catálogo y devuelve como máximo 2", () => {
    const result = recommend(fixture, { para: "cualquiera", momento: "siempre", caracter: "floral" });
    expect(result).toHaveLength(2);
    expect(result.every((p) => p.gender === "femenino")).toBe(true);
  });

  it("no recomienda perfumes agotados", () => {
    expect(slugs(recommend(fixture, { para: "el" }, 20))).not.toContain("agotado-el");
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

  it("siempre recomienda algo del catálogo real para cualquier respuesta de género", () => {
    for (const para of ["ella", "el", "cualquiera"] as const) {
      expect(recommend(products, { para }).length).toBeGreaterThan(0);
    }
  });
});

describe("profileOf", () => {
  it("usa el perfil declarado", () => {
    const declared = products.find((p) => p.profile)!;
    expect(profileOf(declared)).toEqual(declared.profile);
  });

  it("deduce uno por familia cuando falta", () => {
    const mock = mockProducts.find((p) => p.family === "gourmand")!;
    expect(profileOf(mock)).toEqual({ moment: "siempre", character: ["calido"] });
  });
});
