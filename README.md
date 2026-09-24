# Fracción — catálogo de decants de perfume

Sitio de catálogo para un negocio local de decants de 10 ml en Higuera de
Zaragoza, Sinaloa. Sin carrito ni pagos: cada perfume tiene su página y la
venta se cierra por WhatsApp.

- **Especificación y decisiones:** [`specs/`](specs/) (constitución, spec,
  plan, identidad y tareas).
- **Stack:** Next.js 16 (export estático), TypeScript, Tailwind CSS 4.

---

## Antes de publicar: datos pendientes

Estos datos son provisionales. El sitio funciona con ellos, pero hay que
cambiarlos antes de compartirlo:

| Qué | Dónde | Hoy |
|---|---|---|
| **Número de WhatsApp** | `config/site.ts` → `whatsappNumber` | ✅ +52 667 856 2243 |
| **Precios** | `data/products.ts` → `presentations` | $450 / $480 / $450 / $450, de ejemplo |
| **Dominio del sitio** | variable `NEXT_PUBLIC_SITE_URL` al desplegar | — |
| **Nombre del negocio** | `config/site.ts` → `brandName` y `wordmark`; `BRAND` en `scripts/photos/cutout.py` | "Fracción", provisional |
| **Imágenes en alta resolución** | `photos-raw/` → `npm run images` | ~430×1024 px |

Opcionales: `schedule` (horario) e `instagram` en `config/site.ts`. Si están
vacíos, no se muestran.

## Trabajar en el sitio

Requiere Node.js 24.

```bash
npm install
npm run dev          # http://localhost:3000
```

Para ver el catálogo con 12 perfumes ficticios (pruebas de diseño), crea un
archivo `.env.development.local` con `NEXT_PUBLIC_INCLUDE_MOCKS=true` y
reinicia `npm run dev`. En producción nunca aparecen.

## Agregar o editar un perfume

**La forma fácil:** en Claude Code, escribe `/nuevo-perfume` seguido del
nombre (por ejemplo `/nuevo-perfume Dior Homme Intense, $480`) y adjunta la
foto del frasco con su decant. El comando investiga las notas con fuentes,
recorta las imágenes, lo agrega al catálogo y al hero, corre las pruebas y
guarda los cambios. Después solo vuelves a publicar en Netlify.

El proceso manual, por si lo necesitas:

**Regla de contenido:** todo lo que se dice de un perfume (notas, descripción,
perfumista, año, familia) debe salir de la marca o de fuentes especializadas,
y esas fuentes se listan en `sources` (se muestran en la página). Las
descripciones se redactan con palabras propias, sin copiar el texto de la
marca. Si algo no se puede respaldar, no se publica.

1. Copia una entrada en `data/products.ts` y cambia sus datos. El `slug`
   es la dirección de su página (`/producto/<slug>`).
2. Guarda la imagen de la escena (frasco + decant, como las actuales) en
   `photos-raw/<slug>.png`. Si solo tienes foto del frasco, nómbrala
   `photos-raw/<slug>.frasco.png` (la página funciona igual, sin foto del
   decant, hasta que tengas la escena). Si tienes ambas, el frasco sale de la
   foto limpia y el decant de la escena: útil cuando la escena tiene adornos
   delante del frasco. Para adornos pegados o pisos que reflejan, define
   cajas de recorte en `scripts/photos/overrides.json`.
3. Corre `npm run images`: recorta el frasco y el decant, y genera las
   imágenes del sitio y la vista previa para WhatsApp en
   `public/products/<slug>/`.
4. Revisa los recortes en `photos-out/<slug>/review.png`.
5. `npm test` confirma que no falten datos ni imágenes.

Marcar un perfume como destacado (`featured: true`) lo pone en el carrusel
de la portada. `available: false` lo marca como agotado: sigue visible y su
botón cambia a "Avisarme cuando vuelva".

### Entorno de imágenes (solo la primera vez)

Usa Python 3.12 y el modelo BiRefNet, que corre en la computadora y no sube
nada a internet. La primera ejecución descarga el modelo (~1 GB).

```bash
python -m venv scripts/photos/.venv
scripts/photos/.venv/Scripts/python -m pip install -r scripts/photos/requirements.txt
```

## Pruebas

```bash
npm test             # lógica y validación del catálogo (Vitest)
npm run test:e2e     # construye el sitio y lo prueba en Edge, escritorio y celular (Playwright)
npm run lint
```

## Publicar

El sitio está publicado en **Netlify**, subiendo la carpeta a mano:

1. `npm run publicar`: construye el sitio y abre la carpeta `out`.
2. En Netlify → tu sitio → *Deploys*, arrastra la carpeta `out` a la zona
   de subida.

Como el sitio se construye en esta computadora, la dirección pública va en
`.env.production.local` (`NEXT_PUBLIC_SITE_URL=https://…`); sin ella, las
vistas previas al compartir en WhatsApp no muestran imagen. Netlify también
lee `public/_headers`.

Si más adelante conectas Netlify a GitHub, cada cambio se publica solo:
build command `npm run build`, publish directory `out` y la misma variable
`NEXT_PUBLIC_SITE_URL` en la configuración del sitio.

### Alternativa: Cloudflare Pages

Es gratis, permite uso comercial y es rápido en México. El plan gratuito de
Vercel **no** permite uso comercial.

1. Sube este repositorio a GitHub (privado está bien).
2. En Cloudflare → *Workers & Pages* → *Create* → *Pages* → conecta el
   repositorio.
3. Configuración de build:
   - **Framework preset:** Next.js (Static HTML Export)
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
   - **Variable de entorno:** `NEXT_PUBLIC_SITE_URL` = la dirección final
     (p. ej. `https://fraccion.pages.dev` o tu dominio).
4. Cada `git push` publica una versión nueva automáticamente.

`public/_headers` ya configura la caché y cabeceras básicas para Cloudflare.
Para probar el sitio final en local: `npm run build` y luego `npm start`
(http://localhost:3000).

## Estructura

```
app/            páginas: portada, /producto/[slug], 404, sitemap, robots
components/     hero, catálogo, detalle, WhatsApp, secciones, nav y footer
config/site.ts  datos del negocio
data/           catálogo real (products.ts) y ficticio (mock-products.ts)
lib/            precios, WhatsApp, filtros y relacionados
scripts/        imágenes (photos/), capturas, servidor estático, postbuild
specs/          especificación spec-driven
tests/          unit (Vitest) y e2e (Playwright)
```
