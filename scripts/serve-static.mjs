// Sirve la carpeta out/ como lo haría un hosting estático (Cloudflare Pages):
// /ruta → ruta.html o ruta/index.html; lo demás → 404.html con estado 404.
// Uso: node scripts/serve-static.mjs [puerto]
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { createBrotliCompress } from "node:zlib";

const root = join(process.cwd(), "out");
const port = Number(process.argv[2] ?? 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

function resolve(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^([/\\])+/, "");
  const base = join(root, clean);
  if (!base.startsWith(root)) return null;
  for (const candidate of [base, `${base}.html`, join(base, "index.html")]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

// Texto comprimido con brotli, como hacen los hostings (Cloudflare Pages).
const compressible = new Set([".html", ".js", ".css", ".json", ".txt", ".xml", ".svg"]);

createServer((req, res) => {
  const file = resolve(req.url ?? "/");
  const target = file ?? join(root, "404.html");
  const ext = extname(target);
  const headers = { "content-type": types[ext] ?? "application/octet-stream" };
  const useBrotli = compressible.has(ext) && /\bbr\b/.test(req.headers["accept-encoding"] ?? "");
  if (useBrotli) headers["content-encoding"] = "br";
  if (target.includes(`${join(root, "_next", "static")}`)) headers["cache-control"] = "public, max-age=31536000, immutable";
  res.writeHead(file ? 200 : 404, headers);
  const stream = createReadStream(target);
  (useBrotli ? stream.pipe(createBrotliCompress()) : stream).pipe(res);
}).listen(port, () => console.log(`Sitio estático en http://localhost:${port}`));
