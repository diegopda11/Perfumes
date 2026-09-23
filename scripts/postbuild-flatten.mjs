// Corrige el export estático de Next 16 en Windows: los archivos de prefetch de
// rutas anidadas se escriben como carpetas (__next.producto/$d$slug/__PAGE__.txt),
// pero el navegador los pide con puntos (__next.producto.$d$slug.__PAGE__.txt).
// Sin esto, la navegación entre páginas no es instantánea y la consola muestra 404.
// Se ejecuta solo después de `npm run build` (script "postbuild").
import { copyFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = join(process.cwd(), "out");
let copied = 0;

function filesUnder(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? filesUnder(full) : [full];
  });
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (!statSync(full).isDirectory()) continue;
    if (name.startsWith("__next.")) {
      for (const file of filesUnder(full)) {
        const flat = join(dir, `${name}.${relative(full, file).split(sep).join(".")}`);
        if (!existsSync(flat)) {
          copyFileSync(file, flat);
          copied++;
        }
      }
    } else {
      walk(full);
    }
  }
}

if (existsSync(root)) walk(root);
console.log(`postbuild: ${copied} archivos de prefetch con nombre plano`);
