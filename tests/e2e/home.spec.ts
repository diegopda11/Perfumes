import { expect, test } from "@playwright/test";
import { emptyFilterQuery, femeninoCount, position, total } from "./catalog-facts";

const liveText = (page: import("@playwright/test").Page) =>
  page.locator('[aria-roledescription="carrusel"] [aria-live="polite"]');

test.describe("Home", () => {
  test("dice qué se vende y muestra el primer destacado (CA-1.1)", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Perfumes originales en decants de 10 ml");
    await expect(liveText(page)).toContainText(position(1));
  });

  test("las flechas cambian de perfume y el carrusel no avanza solo (CA-1.3, CA-1.7)", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Perfume siguiente" }).locator("visible=true").click();
    await expect(liveText(page)).toContainText(position(2));
    await page.waitForTimeout(6000);
    await expect(liveText(page)).toContainText(position(2));
    await page.getByRole("button", { name: "Perfume anterior" }).locator("visible=true").click();
    await expect(liveText(page)).toContainText(position(1));
  });

  test("carga y navega sin errores en la consola ni recursos faltantes", async ({ page }) => {
    const problems: string[] = [];
    page.on("console", (msg) => msg.type() === "error" && problems.push(msg.text()));
    page.on("response", (res) => res.status() >= 400 && problems.push(`${res.status()} ${res.url()}`));
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator("#catalogo").getByRole("link", { name: /Sauvage/ }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sauvage");
    await page.waitForLoadState("networkidle");
    expect(problems).toEqual([]);
  });

  test("no tiene ningún enlace de WhatsApp (CA-4.4)", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0);
  });

  test("un filtro cambia la URL y la grilla (CA-2.8)", async ({ page }) => {
    await page.goto("/");
    const catalog = page.locator("#catalogo");
    await expect(catalog.getByRole("listitem")).toHaveCount(total);
    await catalog.getByRole("button", { name: "Femenino" }).click();
    await expect(page).toHaveURL(/genero=femenino/);
    await expect(catalog.getByRole("listitem")).toHaveCount(femeninoCount);
  });

  test("filtros sin resultados ofrecen quitarlos (CA-2.9)", async ({ page }) => {
    await page.goto(`/${emptyFilterQuery()}`);
    const catalog = page.locator("#catalogo");
    await expect(catalog.getByText("Ningún perfume coincide con esos filtros")).toBeVisible();
    await catalog.getByRole("button", { name: "Quitar filtros" }).click();
    await expect(catalog.getByRole("listitem")).toHaveCount(total);
  });

  test("tocar un perfume del catálogo abre su detalle (CA-2.3)", async ({ page }) => {
    await page.goto("/");
    await page.locator("#catalogo").getByRole("link", { name: /Libre/ }).click();
    await expect(page).toHaveURL(/\/producto\/ysl-libre-edp/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Libre");
  });

  test("el footer muestra la localidad y el aviso de marcas (CA-5.3, RNF-7)", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("#contacto");
    await expect(footer).toContainText("Higuera de Zaragoza, Sinaloa");
    await expect(footer).toContainText("No estamos afiliados");
  });
});

test.describe("Home en escritorio", () => {
  test.skip(({ isMobile }) => isMobile, "solo escritorio");

  test("←/→ cambian de perfume con el foco en el carrusel (CA-1.3)", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Perfume siguiente" }).locator("visible=true").focus();
    await page.keyboard.press("ArrowRight");
    await expect(liveText(page)).toContainText(position(2));
  });

  test("la tarjeta de vidrio lleva al detalle (CA-1.5)", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Dior\s*Sauvage/ }).first().click();
    await expect(page).toHaveURL(/\/producto\/dior-sauvage-edp/);
  });
});

test.describe("Home en celular", () => {
  test.skip(({ isMobile }) => !isMobile, "solo celular");

  test("deslizar cambia de perfume sin abrir el detalle (CA-1.3)", async ({ page }) => {
    await page.goto("/");
    const { width, height } = page.viewportSize()!;
    await page.mouse.move(width * 0.8, height * 0.45);
    await page.mouse.down();
    await page.mouse.move(width * 0.2, height * 0.45, { steps: 8 });
    await page.mouse.up();
    await expect(liveText(page)).toContainText(position(2));
    await expect(page).toHaveURL(/\/$/);
  });

  test("el menú se abre y se cierra con Esc (CA-6.2)", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Abrir menú" }).click();
    const menu = page.getByRole("dialog", { name: "Menú" });
    await expect(menu).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
  });
});
