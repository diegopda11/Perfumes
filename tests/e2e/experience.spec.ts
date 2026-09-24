import { expect, test } from "@playwright/test";

/** Spec 002 — experiencia premium. */

test.describe("Entrada 'la fracción se llena' (P3)", () => {
  test("corre cada vez que se abre la portada y termina sola (CA-P3.1)", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/\bintro\b/);
    // el wordmark (LCP) está visible desde el inicio (CA-P3.2)
    await expect(page.locator(".hero-wordmark")).toBeVisible();
    await expect(page.locator("html")).not.toHaveClass(/\bintro\b/, { timeout: 5000 });
    await page.reload();
    await expect(page.locator("html")).toHaveClass(/\bintro\b/);
  });

  test("cualquier interacción la salta", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("html")).toHaveClass(/\bintro\b/);
    await page.keyboard.press("Tab");
    await expect(page.locator("html")).not.toHaveClass(/\bintro\b/);
  });

  test("no se puede ver en otras páginas", async ({ page }) => {
    await page.goto("/producto/dior-sauvage-edp");
    await expect(page.locator("html")).not.toHaveClass(/\bintro\b/);
  });
});

test.describe("Con movimiento reducido", () => {
  test.use({ reducedMotion: "reduce" });

  test("no hay entrada (CA-P3.1)", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveClass(/\bintro\b/);
  });
});

test.describe("Encuentra tu perfume (P7)", () => {
  test("tres respuestas llevan a una recomendación y a su página (CA-P7.1, CA-P7.3)", async ({ page }) => {
    await page.goto("/");
    const finder = page.locator("#encuentra");
    await finder.getByText("Para él").click();
    await finder.getByText("A toda hora").click();
    await finder.getByText("Especiado y magnético").click();
    await expect(finder.getByText("Te recomendamos empezar por")).toBeVisible();
    await expect(finder.locator('a[href*="wa.me"]')).toHaveCount(0);
    // el perfume exacto depende del catálogo (la lógica se prueba en unit)
    await finder.getByText("Ver perfume").click();
    await expect(page).toHaveURL(/\/producto\/[a-z0-9-]+$/);
  });

  test("se puede volver atrás y empezar de nuevo", async ({ page }) => {
    await page.goto("/");
    const finder = page.locator("#encuentra");
    await finder.getByText("Para ella").click();
    await finder.getByRole("button", { name: "Anterior" }).click();
    await expect(finder.getByText("¿Para quién es?")).toBeVisible();
    await finder.getByText("Me da igual").click();
    await finder.getByText("De día").click();
    await finder.getByText("Floral y romántico").click();
    await finder.getByRole("button", { name: "Empezar de nuevo" }).click();
    await expect(finder.getByText("Pregunta 1 de 3")).toBeVisible();
  });
});

test.describe("Atmósfera y transición (P1, P2)", () => {
  test("el detalle usa la atmósfera de su perfume (CA-P1.1)", async ({ page }) => {
    await page.goto("/producto/chanel-coco-mademoiselle-edp");
    const base = await page.locator("main").evaluate((el) => el.style.getPropertyValue("--atm-base"));
    expect(base).toBe("#2a1611");
  });

  test("el frasco del catálogo se transforma en el del detalle (CA-P2.1)", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "View Transitions");
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => {
      const w = window as unknown as { __vt: string[] };
      w.__vt = [];
      const original = document.startViewTransition.bind(document);
      document.startViewTransition = ((arg: Parameters<typeof original>[0]) => {
        const transition = original(arg);
        transition.ready
          .then(() => {
            for (const a of document.getAnimations()) {
              const pseudo = (a.effect as KeyframeEffect | null)?.pseudoElement;
              if (pseudo) w.__vt.push(pseudo);
            }
          })
          .catch(() => {});
        return transition;
      }) as typeof document.startViewTransition;
    });
    await page.locator("#catalogo").getByRole("link", { name: /Libre/ }).click();
    await expect(page).toHaveURL(/\/producto\/ysl-libre-edp/);
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { __vt: string[] }).__vt))
      .toContainEqual("::view-transition-group(bottle-ysl-libre-edp)");
  });
});
