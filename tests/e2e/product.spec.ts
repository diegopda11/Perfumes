import { expect, test, type Page } from "@playwright/test";
import { escapeRegExp, multiSize, relatedCount, sample } from "./catalog-facts";
import { formatPrice } from "@/lib/format";

/** Toca la píldora del tamaño, como lo haría el visitante (el radio está oculto a la vista). */
const chooseSize = (page: Page, ml: number) =>
  page
    .getByRole("group", { name: "Tamaño del decant" })
    .locator("label")
    .filter({ hasText: new RegExp(`^${ml}\\s*ml`) })
    .click();

const whatsAppText = async (page: Page) => {
  const button = page.getByRole("link", { name: /Consultar por WhatsApp/ }).locator("visible=true").first();
  await expect(button).toBeVisible();
  return new URL((await button.getAttribute("href"))!).searchParams.get("text");
};

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
    expect(text).toBe(`Hola, me interesa el decant de ${sample.presentations[0].ml}ml de ${sample.name} de ${sample.brand}`);
  });

  test("elegir otro tamaño cambia el precio y el mensaje de WhatsApp (spec 003, CA-2)", async ({ page }) => {
    test.skip(!multiSize, "ningún perfume tiene más de un tamaño");
    const [first, second] = multiSize!.presentations;
    const message = (ml: number) => `Hola, me interesa el decant de ${ml}ml de ${multiSize!.name} de ${multiSize!.brand}`;
    await page.goto(`/producto/${multiSize!.slug}`);

    const sizes = page.getByRole("group", { name: "Tamaño del decant" });
    const radio = (ml: number) => sizes.getByRole("radio", { name: new RegExp(`^${ml}\\s*ml`) });
    await expect(radio(first.ml)).toBeChecked();
    await expect(page.getByTestId("precio")).toHaveText(formatPrice(first.price));
    expect(await whatsAppText(page)).toBe(message(first.ml));

    await chooseSize(page, second.ml);
    await expect(radio(second.ml)).toBeChecked();
    await expect(page.getByTestId("precio")).toHaveText(formatPrice(second.price));
    await expect(page.getByText(new RegExp(`por un decant de ${second.ml}\\s*ml`))).toBeVisible();
    await expect.poll(() => whatsAppText(page)).toBe(message(second.ml));
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

  test("la barra fija usa el tamaño elegido (spec 003, CA-2.4)", async ({ page }) => {
    test.skip(!multiSize, "ningún perfume tiene más de un tamaño");
    const second = multiSize!.presentations[1];
    await page.goto(`/producto/${multiSize!.slug}`);
    const sizes = page.getByRole("group", { name: "Tamaño del decant" });
    const radio = sizes.getByRole("radio", { name: new RegExp(`^${second.ml}\\s*ml`) });
    await chooseSize(page, second.ml);
    await expect(radio).toBeChecked();
    await page.mouse.wheel(0, 1500);
    const bar = page.getByRole("link", { name: /Consultar por WhatsApp/ }).locator("visible=true");
    await expect(bar).toBeInViewport();
    const text = new URL((await bar.getAttribute("href"))!).searchParams.get("text");
    expect(text).toContain(`decant de ${second.ml}ml`);
  });
});
