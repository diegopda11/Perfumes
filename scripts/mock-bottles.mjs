// Genera frascos ilustrados (SVG) para el catálogo ficticio de desarrollo.
// Uso: node scripts/mock-bottles.mjs  →  public/mock/*.svg
import { mkdirSync, writeFileSync } from "node:fs";

const out = new URL("../public/mock/", import.meta.url);
mkdirSync(out, { recursive: true });

// [nombre, color del líquido (arriba, abajo), color de la tapa (oscuro, claro), forma]
const bottles = [
  ["ambar", "#7a3f12", "#c77a2a", "#5a4520", "#e0c27a", "tall"],
  ["noche", "#0b1020", "#2c3f66", "#101010", "#4a4a4a", "round"],
  ["rosa", "#b0506a", "#f0a7b5", "#9c8250", "#f3dfae", "arch"],
  ["verde", "#1f3d2a", "#5f8f63", "#2a2a2a", "#6b6b6b", "tall"],
  ["cielo", "#6d8fb3", "#d7e6f2", "#b8b8b8", "#f4f4f4", "round"],
  ["humo", "#2b2426", "#6e5b5f", "#8a6a3a", "#d9b27a", "arch"],
];

function body(shape) {
  if (shape === "round") return `<rect x="14" y="120" width="192" height="276" rx="72"/>`;
  if (shape === "arch") return `<path d="M20 396V208a90 90 0 0 1 180 0v188z"/>`;
  return `<rect x="24" y="112" width="172" height="284" rx="14"/>`;
}

for (const [name, top, bottom, capDark, capLight, shape] of bottles) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 400">
  <defs>
    <linearGradient id="l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>
    <linearGradient id="c" x1="0" x2="1"><stop offset="0" stop-color="${capDark}"/><stop offset=".5" stop-color="${capLight}"/><stop offset="1" stop-color="${capDark}"/></linearGradient>
    <linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset=".35" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#fff" stop-opacity=".12"/></linearGradient>
    <clipPath id="b">${body(shape)}</clipPath>
  </defs>
  <rect x="78" y="14" width="64" height="78" rx="6" fill="url(#c)"/>
  <rect x="92" y="90" width="36" height="24" fill="${capDark}"/>
  <g clip-path="url(#b)">
    <rect width="220" height="400" fill="url(#l)"/>
    <rect width="220" height="400" fill="url(#g)"/>
    <rect x="34" y="120" width="10" height="260" rx="5" fill="#fff" opacity=".22"/>
  </g>
  <g fill="none" stroke="#fff" stroke-opacity=".3">${body(shape)}</g>
</svg>
`;
  writeFileSync(new URL(`${name}.svg`, out), svg);
}

const decant = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 250">
  <defs><linearGradient id="c" x1="0" x2="1"><stop offset="0" stop-color="#8c6f35"/><stop offset=".5" stop-color="#ebd49a"/><stop offset="1" stop-color="#9c7c3e"/></linearGradient></defs>
  <rect x="10" y="2" width="40" height="70" rx="6" fill="url(#c)"/>
  <rect x="8" y="72" width="44" height="174" rx="8" fill="#dce6ee" fill-opacity=".16" stroke="#dce6ee" stroke-opacity=".6"/>
  <rect x="13" y="120" width="34" height="120" rx="5" fill="#ebd49a" fill-opacity=".6"/>
</svg>
`;
writeFileSync(new URL("decant.svg", out), decant);
console.log("Frascos ficticios generados en public/mock/");
