import { expect, test } from "@playwright/test";
import { escapeRegExp, relatedCount, sample } from "./catalog-facts";

test.describe("Detalle de producto", () => {
  test("muestra la información completa (CA-3.1 a CA-3.3)", async ({ page }) => {
    await page.goto(`/producto/${sample.slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(sample.name);
    await expect(page.getByText("Eau de parfum", { exact: false }).first()).toBeVisible();
    for (const tier of ["Salida", "Corazón", "Fondo"]) {
      await expect(page.getByText(tier, { exact: true })).toBeVisible();
    }
    await expect(page.getByRole("heading", { name: "Lo que recibes" })).toBeVisible();
    await expect(page.getByText("No es el frasco completo", { exact: false })).toBeVisible();
    await expect(page.getByText("Perfume original, envasado de su frasco auténtico.")).toBeVisible();
  });

  test("el botón de WhatsApp lleva el mensaje del spec (CA-4.1, CA-4.2)", async ({ page }) => {
    await page.goto(`/producto/${sample.slug}`);
    const button = page.getByRole("link", { name: /Consultar por WhatsApp/ }).locator("visible=true").first();
    await expect(button).toBeVisible();
    const href = await button.getAttribute("href");
    expect(href).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
    const text = new URL(href!).searchParams.get("text");
    expect(text).toBe(`Hola, me interesa el decant de 10ml de ${sample.name} de ${sample.brand}`);
  });

  test("tiene vista previa para compartir (CA-7.1)", async ({ page }) => {
    await page.goto(`/producto/${sample.slug}`);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      new RegExp(`/products/${sample.slug}/og\\.jpg$`),
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      new RegExp(escapeRegExp(sample.name)),
    );
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", /MXN/);
  });

  test("sugiere otros perfumes (CA-3.6)", async ({ page }) => {
    await page.goto(`/producto/${sample.slug}`);
    const related = page.locator('section[aria-labelledby="relacionados-title"]');
    await expect(related.getByRole("listitem")).toHaveCount(relatedCount(sample.slug));
  });

  test("un perfume que no existe da la 404 de la marca (CA-3.5)", async ({ page }) => {
    const response = await page.goto("/producto/no-existe");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Este perfume no está en la vitrina" })).toBeVisible();
    await page.getByRole("link", { name: "Ver la colección" }).click();
    await expect(page).toHaveURL(/\/#catalogo$/);
  });
});

test.describe("Detalle en celular", () => {
  test.skip(({ isMobile }) => !isMobile, "solo celular");

  test("la barra de WhatsApp queda fija abajo (CA-4.3)", async ({ page }) => {
    await page.goto(`/producto/${sample.slug}`);
    await page.mouse.wheel(0, 1500);
    const bar = page.getByRole("link", { name: /Consultar por WhatsApp/ }).locator("visible=true");
    await expect(bar).toBeInViewport();
  });
});
