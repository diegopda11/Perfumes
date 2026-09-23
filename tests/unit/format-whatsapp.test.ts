import { describe, expect, it } from "vitest";
import { formatPrice } from "@/lib/format";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

describe("formatPrice (RNF-8)", () => {
  it("usa pesos mexicanos sin centavos", () => {
    expect(formatPrice(390)).toBe("$390 MXN");
  });

  it("separa miles con coma", () => {
    expect(formatPrice(1250)).toBe("$1,250 MXN");
  });
});

describe("buildWhatsAppUrl (CA-4.2, CA-4.5)", () => {
  const decode = (url: string) => decodeURIComponent(new URL(url).searchParams.get("text") ?? "");

  it("arma el mensaje de consulta del spec", () => {
    const url = buildWhatsAppUrl("Sauvage de Dior", "consulta", { number: "526681234567" });
    expect(url.startsWith("https://wa.me/526681234567?text=")).toBe(true);
    expect(decode(url)).toBe("Hola, me interesa el decant de 10ml de Sauvage de Dior");
  });

  it("arma el mensaje de aviso para agotados", () => {
    const url = buildWhatsAppUrl("Libre de Yves Saint Laurent", "aviso", { number: "526681234567" });
    expect(decode(url)).toBe(
      "Hola, ¿me avisas cuando vuelva a estar disponible el decant de 10ml de Libre de Yves Saint Laurent?",
    );
  });

  it("limpia el número y codifica caracteres especiales", () => {
    const url = buildWhatsAppUrl("Coco & Co", "consulta", { number: "+52 668 123 4567" });
    expect(url).toContain("wa.me/526681234567?");
    expect(url).not.toContain(" ");
    expect(decode(url)).toContain("Coco & Co");
  });
});
