import { defineConfig, devices } from "@playwright/test";

/**
 * Pruebas e2e sobre el sitio estático ya construido (out/), servido igual
 * que en el hosting. Usan el Edge instalado en Windows: no descargan
 * navegadores. Correr con `npm run test:e2e`.
 */
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://localhost:4173",
    channel: "msedge",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "escritorio", use: { viewport: { width: 1440, height: 900 } } },
    {
      name: "celular",
      use: { ...devices["Pixel 7"], channel: "msedge" },
    },
  ],
  webServer: {
    command: "node scripts/serve-static.mjs 4173",
    url: "http://localhost:4173",
    reuseExistingServer: true,
  },
});
