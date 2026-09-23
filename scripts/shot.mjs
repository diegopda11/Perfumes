// Capturas para revisión visual con el Edge instalado (sin descargar navegadores).
// Uso: node scripts/shot.mjs <url> <salida.png> [ancho] [alto] [--full] [--at=#selector] [--reduced]
import { chromium } from "@playwright/test";

const [url, out, width = "1440", height = "900", ...flags] = process.argv.slice(2);
const full = flags.includes("--full");
const at = flags.find((f) => f.startsWith("--at="))?.slice(5);
const reduced = flags.includes("--reduced");

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({
  viewport: { width: Number(width), height: Number(height) },
  isMobile: Number(width) < 768,
  hasTouch: Number(width) < 768,
  reducedMotion: reduced ? "reduce" : "no-preference",
});
await page.goto(url, { waitUntil: "networkidle" });
if (at) await page.locator(at).first().evaluate((el) => el.scrollIntoView({ block: "start" }));
await page.waitForTimeout(1200);
await page.screenshot({ path: out, fullPage: full });
await browser.close();
console.log(out);
