import { describe, expect, it } from "vitest";
import { products } from "@/data/products";
import { catalogSizes, formatPriceList, formatSizes, priceListParts, toPresentations } from "@/lib/presentations";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

describe("toPresentations (spec 003, CA-1)", () => {
  it("sin price5ml solo hay decant de 10 ml", () => {
    expect(toPresentations({ price: 220 })).toEqual([{ ml: 10, price: 220 }]);
  });

  it("con price5ml agrega el de 5 ml después del de 10 ml", () => {
    expect(toPresentations({ price: 220, price5ml: 130 })).toEqual([
      { ml: 10, price: 220 },
      { ml: 5, price: 130 },
    ]);
  });

  it("presentations, si se escribe a mano, manda", () => {
    const custom = [{ ml: 3, price: 60 }] as const;
    expect(toPresentations({ price: 220, price5ml: 130, presentations: [...custom] })).toEqual(custom);
  });
});

/** Los precios usan espacios que no se cortan; aquí se comparan como espacios normales. */
const plain = (text: string) => text.replace(/\u00a0/g, " ");

describe("formatSizes y formatPriceList (spec 003, CA-3, CA-4)", () => {
  it("nombra los tamaños de menor a mayor", () => {
    expect(plain(formatSizes([10]))).toBe("10 ml");
    expect(plain(formatSizes([10, 5]))).toBe("5 y 10 ml");
    expect(plain(formatSizes([10, 5, 10], "o"))).toBe("5 o 10 ml");
  });

  it("una sola presentación usa el formato de precio de siempre", () => {
    expect(plain(formatPriceList([{ ml: 10, price: 220 }]))).toBe("$220 MXN");
  });

  it("dos presentaciones muestran ambos precios con la moneda una vez", () => {
    expect(
      plain(
        formatPriceList([
          { ml: 10, price: 220 },
          { ml: 5, price: 130 },
        ]),
      ),
    ).toBe("10 ml $220 · 5 ml $130 MXN");
  });

  it("separa el precio en partes que no se cortan por dentro", () => {
    expect(
      priceListParts([
        { ml: 10, price: 220 },
        { ml: 5, price: 130 },
      ]).map(plain),
    ).toEqual(["10 ml $220", "5 ml $130 MXN"]);
    expect(priceListParts([{ ml: 10, price: 220 }]).map(plain)).toEqual(["$220 MXN"]);
  });

  it("los tamaños del catálogo salen de los datos", () => {
    expect(catalogSizes([{ presentations: [{ ml: 10, price: 1 }] }])).toEqual([10]);
    expect(
      catalogSizes([
        { presentations: [{ ml: 10, price: 1 }] },
        { presentations: [{ ml: 10, price: 1 }, { ml: 5, price: 1 }] },
      ]),
    ).toEqual([5, 10]);
  });
});

describe("precios del dueño (spec 003, CA-1.2)", () => {
  const prices = (slug: string) =>
    products.find((p) => p.slug === slug)?.presentations.map((p) => [p.ml, p.price]);

  it.each([
    ["azzaro-the-most-wanted-edp-intense", 200, 130],
    ["armaf-club-de-nuit-urban-man-elixir-edp", 180, 100],
    ["dumont-nitro-red-edp", 150, 90],
    ["lattafa-qaed-al-fursan-edp", 130, 80],
  ])("%s: 10 ml $%i, 5 ml $%i", (slug, p10, p5) => {
    expect(prices(slug)).toEqual([
      [10, p10],
      [5, p5],
    ]);
  });
});

describe("WhatsApp con el tamaño elegido (spec 003, CA-2.3)", () => {
  const decode = (url: string) => new URL(url).searchParams.get("text");

  it("consulta por el decant de 5 ml", () => {
    const url = buildWhatsAppUrl("Nitro Red de Dumont", "consulta", { number: "526681234567", ml: 5 });
    expect(decode(url)).toBe("Hola, me interesa el decant de 5ml de Nitro Red de Dumont");
  });

  it("aviso de agotado por el decant de 5 ml", () => {
    const url = buildWhatsAppUrl("Nitro Red de Dumont", "aviso", { number: "526681234567", ml: 5 });
    expect(decode(url)).toBe(
      "Hola, ¿me avisas cuando vuelva a estar disponible el decant de 5ml de Nitro Red de Dumont?",
    );
  });
});
