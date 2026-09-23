# Plan 001 — Catálogo MVP

- **Estado:** Borrador para revisión
- **Fecha:** 2026-09-23
- **Entrada:** `spec.md` (clarificada), `identidad.md` (dirección Fracción),
  `../constitution.md`
- **Salida siguiente:** `tasks.md`

---

## 1. Resumen técnico

Sitio **100% estático**: todo el contenido vive en archivos del repositorio,
no hay backend ni base de datos. Next.js genera cada página en el build
(home, un detalle por perfume, 404) y el resultado se publica en un hosting
estático. Las imágenes se procesan antes, con un script propio (recorte y
versiones ligeras), no en el servidor.

| Pieza | Elección | Motivo |
|---|---|---|
| Framework | Next.js (App Router, última estable), TypeScript estricto | Lo pide el CLAUDE.md; SSG nativo |
| Salida | `output: 'export'` (HTML estático) | Sin servidor que mantener; hosting gratis |
| Estilos | Tailwind CSS v4 con tokens en `@theme` | Paleta intercambiable (Constitución VI) |
| Fuentes | `next/font/google`: Bodoni Moda + Instrument Sans | Se sirven desde el propio sitio, sin saltos de layout |
| Imágenes | Pipeline propio → WebP en `public/` | `next/image` no optimiza en export estático; además hay que recortar |
| Animación | CSS (transform/opacity) + JS mínimo | Sin framer-motion: menos peso en celular |
| Pruebas | Vitest (lógica) + Playwright (flujos clave) | Verifican los criterios de aceptación |

## 2. Estructura del proyecto

```
/
├── app/
│   ├── layout.tsx              # fuentes, metadata base, <SiteNav/>, <SiteFooter/>
│   ├── page.tsx                # Home: Hero, Catálogo, Cómo funciona, Nosotros
│   ├── producto/[slug]/page.tsx# Detalle (generateStaticParams + generateMetadata)
│   ├── not-found.tsx           # 404 con la estética de la marca
│   └── globals.css             # Tailwind + tokens (@theme)
├── components/
│   ├── brand/      DecantVial.tsx, Wordmark.tsx, AuthenticitySeal.tsx
│   ├── layout/     SiteNav.tsx, MobileMenu.tsx, SiteFooter.tsx
│   ├── hero/       Hero.tsx, HeroCarousel.tsx, HeroCard.tsx, Spotlight.tsx
│   ├── catalog/    CatalogSection.tsx, FilterChips.tsx, ProductGrid.tsx, ProductCard.tsx
│   ├── product/    ProductDetail.tsx, ProductGallery.tsx, NotesPyramid.tsx,
│   │               DecantShowcase.tsx, RelatedProducts.tsx
│   ├── cta/        WhatsAppButton.tsx, StickyWhatsAppBar.tsx
│   └── sections/   HowItWorks.tsx, About.tsx
├── config/site.ts              # marca, WhatsApp, localidad, moneda, opcionales
├── data/
│   ├── products.ts             # catálogo real (lo que edita el dueño)
│   └── mock-products.ts        # relleno de desarrollo (se desactiva con una variable)
├── lib/
│   ├── catalog.ts              # getProducts, getFeatured, getBySlug, related, filtros
│   ├── format.ts               # formatPrice (es-MX, MXN)
│   └── whatsapp.ts             # buildWhatsAppUrl(product, kind)
├── types/product.ts
├── scripts/photos/             # pipeline de imágenes (ver §6)
├── public/products/<slug>/     # salida del pipeline (no se edita a mano)
├── tests/                      # unit (Vitest) y e2e (Playwright)
└── specs/                      # esta carpeta
```

## 3. Modelo de datos

```ts
// types/product.ts
export type Concentration = 'EDT' | 'EDP' | 'Extrait' | 'Parfum';
export type Gender = 'femenino' | 'masculino' | 'unisex';
export type OlfactoryFamily =
  | 'amaderado' | 'floral' | 'oriental' | 'citrico'
  | 'fresco' | 'gourmand' | 'aromatico' | 'chipre';

export interface Presentation {
  ml: number;      // hoy siempre 10
  price: number;   // MXN, entero, sin centavos
}

export interface Product {
  slug: string;                // "dior-sauvage-edp"
  name: string;                // "Sauvage"
  brand: string;               // "Dior"
  concentration: Concentration;
  family: OlfactoryFamily;
  gender: Gender;
  tagline: string;             // "Pimienta fresca. Ámbar magnético. Estela que se queda."
  description: string;
  highlightNotes: [string, string] | [string, string, string];
  notes: { top: string[]; heart: string[]; base: string[] };
  presentations: [Presentation, ...Presentation[]]; // al menos una
  images: {
    bottle: string;            // /products/<slug>/bottle.webp: frasco recortado (obligatoria)
    decant?: string;           // /products/<slug>/decant.webp: decant recortado
    scene?: string;            // /products/<slug>/scene.webp: frasco + decant juntos
  };
  featured?: boolean;          // aparece en el hero
  available?: boolean;         // por defecto true
  isMock?: boolean;            // solo en mock-products.ts
}
```

- `presentations` es una lista desde ya (Constitución VII): añadir 5 ml
  mañana es agregar un elemento, sin cambiar componentes. La UI de hoy usa
  la primera.
- Un test valida el catálogo en el build: slugs únicos, 2-3 notas
  destacadas, precio > 0 y que existan las imágenes referenciadas.
- **Datos de desarrollo:** `mock-products.ts` agrega unos 12 perfumes
  ficticios con frascos ilustrados. Se incluyen solo si
  `NEXT_PUBLIC_INCLUDE_MOCKS=true`, así producción nunca los muestra por
  accidente.

### Catálogo real inicial (borrador; notas a verificar, precios por definir)

| slug | Salida | Corazón | Fondo |
|---|---|---|---|
| `dior-sauvage-edp` | bergamota | pimienta de Sichuan, lavanda, anís estrellado, nuez moscada | ambroxan, vainilla |
| `chanel-coco-mademoiselle-edp` | naranja, bergamota, toronja | rosa, jazmín, lichi | pachulí, vetiver, vainilla, almizcle blanco |
| `ysl-libre-edp` | lavanda, mandarina, grosella negra | lavanda, azahar, jazmín | vainilla, almizcle, cedro, ámbar gris |

## 4. Configuración y tokens

### `config/site.ts`
```ts
export const site = {
  brandName: 'Fracción',              // placeholder (spec §8)
  wordmark: 'Fracción',
  whatsappNumber: '52XXXXXXXXXX',     // formato internacional, sin "+"
  locality: 'Higuera de Zaragoza, Sinaloa',
  schedule: undefined as string | undefined,   // oculto si está vacío
  instagram: undefined as string | undefined,  // oculto si está vacío
  currency: 'MXN',
  locale: 'es-MX',
  defaultSize: 10,
} as const;
```

### Tokens (Tailwind v4, `app/globals.css`)
Dos capas: **primitivos** (los colores de la identidad) y **semánticos**
(lo que usan los componentes). Cambiar la paleta = editar los primitivos.

```css
@theme {
  /* Primitivos: identidad Fracción */
  --color-ink:        #0C1426;
  --color-night:      #16223B;
  --color-brass:      #C4A05A;
  --color-brass-lit:  #EBD49A;
  --color-glass:      #DCE6EE;
  --color-mist:       #8A97AD;
  --color-pearl:      #EEF1F4;

  /* Semánticos: los únicos que usan los componentes */
  --color-bg:          var(--color-ink);
  --color-surface:     var(--color-night);
  --color-text:        var(--color-pearl);
  --color-text-muted:  var(--color-mist);
  --color-accent:      var(--color-brass);
  --color-accent-lit:  var(--color-brass-lit);
  --color-glass-edge:  color-mix(in oklab, var(--color-glass) 18%, transparent);
  --color-glass-fill:  color-mix(in oklab, var(--color-glass) 7%, transparent);

  --font-display: var(--font-bodoni), serif;
  --font-sans:    var(--font-instrument), sans-serif;
}
```

Contraste verificado: `mist` sobre `ink` ≈ 6.1:1 y `pearl` sobre `ink`
≈ 16:1, ambos AA (RNF-3). El latón encendido se usa en precios y detalles,
nunca en textos largos.

**Escala tipográfica** (razón 1.333): 14 / 16 / 21 / 28 / 38 / 50 px para la
interfaz; el wordmark del hero escala con `clamp()` según el ancho.

## 5. Páginas y componentes

### Home (`app/page.tsx`, estático)
1. **Hero**
   - `Hero` (servidor) arma la escena: `Spotlight` (haz de luz en CSS),
     `Wordmark` detrás y `HeroCarousel` (cliente) al frente.
   - `HeroCarousel`: estado del índice activo; flechas, swipe (pointer
     events con umbral) y ←/→. No avanza solo (CA-1.7).
   - Los frascos laterales usan la foto de frente, desenfocada con CSS
     `filter: blur()`, al 45% de opacidad.
   - Al cambiar de perfume, el frasco que entra aparece con un fundido y un
     leve desplazamiento (CA-IMG.2). Con `prefers-reduced-motion`, cambia
     sin animar.
   - `HeroCard` (vidrio): el decant recortado (o el vial ilustrado
     `DecantVial` si falta), nombre, notas y precio. Se
     oculta por debajo de 768 px; ahí solo aparece el nombre bajo el frasco
     (CA-1.9).
   - Casos límite: con un solo destacado, sin flechas ni laterales (CA-1.8).
     Con cero destacados, se usan los tres primeros disponibles.
   - Accesibilidad: `role="region"` con `aria-roledescription="carrusel"`;
     cada perfume anunciado como "1 de 3"; `aria-live="polite"` al cambiar.
2. **Catálogo** (`#catalogo`)
   - `CatalogSection` → `FilterChips` (cliente) + `ProductGrid`.
   - Filtros por familia y género en la URL (`?familia=&genero=`) con
     `useSearchParams` dentro de `<Suspense>` (requisito del export
     estático). Los chips se derivan del catálogo real (CA-2.10). Los
     agotados van al final (CA-2.5).
   - `ProductCard`: foto de frente, marca, nombre, notas destacadas, precio,
     sello "100% original" y vial pequeño. Toda la tarjeta es un `<Link>`.
     Sin WhatsApp.
3. **Cómo funciona**: 3 pasos numerados (sí es una secuencia real).
4. **Nosotros** (`#nosotros`): qué es un decant y por qué conviene.
5. **Footer** (`#contacto`): localidad, campos opcionales si existen, cómo
   pedir y aviso de marcas ("Las marcas mencionadas pertenecen a sus
   respectivos dueños. No estamos afiliados a ellas.").

### Detalle (`app/producto/[slug]/page.tsx`, estático por slug)
- `generateStaticParams` desde el catálogo; `dynamicParams = false` → un
  slug desconocido da la 404 (CA-3.5).
- `ProductGallery`: el frasco recortado bajo el haz de luz y, debajo, la
  escena frasco + decant.
- `DecantShowcase`: el decant recortado junto a un texto claro: "Recibes un
  decant de 10 ml de este perfume, envasado del frasco original".
- `NotesPyramid`: salida, corazón y fondo.
- `WhatsAppButton`: enlace `https://wa.me/<num>?text=<mensaje codificado>`
  que se abre en una pestaña nueva. Si el perfume está agotado, pasa a
  variante secundaria con el mensaje de "avísame" (CA-4.5).
- `StickyWhatsAppBar`: en celular, una barra fija abajo con precio y botón
  (CA-4.3).
- `RelatedProducts`: 2-4 perfumes de la misma familia; si no alcanzan, se
  completan con la misma marca y luego con otros destacados.
- `generateMetadata`: título, descripción e imagen Open Graph propia
  (CA-7.1).

## 6. Pipeline de imágenes (`scripts/photos/`)

Entrada: `photos-raw/<slug>.png`, una imagen por perfume provista por el
dueño (escena con frasco + decant). Salida en `public/products/<slug>/`:

| Archivo | Contenido | Uso |
|---|---|---|
| `bottle.webp` (+ `-sm`) | Frasco recortado, sin fondo | Hero, tarjetas del catálogo, detalle |
| `decant.webp` | Decant recortado, sin fondo | Tarjeta del hero, detalle |
| `scene.webp` (+ `-sm`) | Escena completa, sin recortar | Detalle |
| `og.jpg` | 1200×630: frasco sobre el fondo de la marca, nombre y precio | Vista previa en WhatsApp |

Pasos:
1. **Segmentación.** Modelo BiRefNet local (vía `rembg`, Python), el mejor
   disponible para bordes finos y vidrio. Corre en la computadora; no sube
   imágenes a ningún servicio.
2. **Separación.** De cada escena salen dos recortes, el frasco y el decant,
   con una caja delimitadora por objeto (se ajusta a mano una vez por
   imagen).
3. **Limpieza.** Se quitan los restos del fondo que suelen quedar en el
   vidrio y el borde se refina con un leve suavizado del canal alfa.
4. **Revisión.** Hoja de contacto de cada recorte sobre el fondo `ink` y
   sobre gris medio, para detectar halos (CA-IMG.1).
5. **Exportación.** WebP (calidad ~85) en dos tamaños y la imagen Open Graph.

Riesgo principal: **resolución**. Las imágenes recibidas miden ~430×1024 px
y el frasco ocupa ~230×560 px. Alcanza para celular y tarjetas, pero en el
hero de escritorio el frasco se verá blando. Se necesitan los originales en
alta resolución (idealmente ≥ 2000 px de alto).

## 7. Rendimiento y accesibilidad (RNF-2, RNF-3, RNF-4)

- LCP del hero = `bottle.webp` del primer destacado, precargado; sin JS
  bloqueante antes de mostrarlo.
- El carrusel, el menú de celular y los filtros son las únicas "islas" de
  JavaScript.
- Fuentes autoalojadas con `display: swap` y subconjunto latino.
- Foco visible en todos los controles; el menú de celular atrapa el foco y
  se cierra con Esc.
- `prefers-reduced-motion`: sin transiciones de entrada ni de
  deslizamiento, sin desplazamiento suave.
- Objetivo: Lighthouse ≥ 90 en celular en las cuatro categorías, medido
  sobre el build de producción.

## 8. Cómo se verifica cada criterio

| Criterios | Verificación |
|---|---|
| CA-4.2, CA-4.5 (mensaje de WhatsApp) | Unit: `buildWhatsAppUrl` codifica el nombre y el mensaje correcto |
| RNF-8 (formato de precio) | Unit: `formatPrice(390)` → `$390 MXN` |
| CA-2.5, CA-2.7-2.10 (filtros, agotados) | Unit en `lib/catalog.ts` + e2e: el chip cambia la URL y la grilla |
| CA-1.3, CA-1.7, CA-1.8 (carrusel) | e2e: flechas y teclado cambian; no avanza tras 10 s; caso de 1 producto |
| CA-3.5 (404) | e2e: `/producto/no-existe` muestra la 404 de la marca |
| CA-4.4 (WhatsApp solo en el detalle) | e2e: la home no contiene enlaces `wa.me` |
| CA-IMG.1 (recortes) | Revisión visual de la hoja de contacto sobre `ink` y gris |
| CA-7.1 (Open Graph) | e2e: el detalle tiene `og:image`, `og:title` y precio |
| Datos del catálogo | Unit: validación de `products.ts` e imágenes existentes |
| RNF-1 a RNF-4 | Revisión manual a 375 / 768 / 1440 px + Lighthouse + skills `accessibility` y `web-design-guidelines` |

## 9. Hosting — decisión pendiente

El sitio es estático, así que cualquier hosting estático sirve.
**Recomendación: Cloudflare Pages** (gratis, permite uso comercial, CDN
rápido en México y despliegue automático desde GitHub).

Ojo: el plan gratuito de Vercel (Hobby) **no permite uso comercial**, y
esto es un negocio. Vercel requeriría el plan Pro (~20 USD/mes). Netlify
gratis también es una opción válida.

Dominio: pendiente (p. ej., `.mx` o `.com`); no bloquea el desarrollo.

## 10. Riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Recorte imperfecto del vidrio | Alto: es lo que más se nota | BiRefNet, limpieza del alfa, revisión sobre fondo oscuro |
| Baja resolución de las imágenes | Alto en escritorio | Pedir originales; mientras, limitar el tamaño del frasco en pantallas grandes |
| Faltan precios o imágenes al lanzar | Bajo | Frasco ilustrado de relleno; precios en un solo archivo |
| Notas olfativas incorrectas | Bajo | Verificación contra la caja o la ficha oficial antes de publicar |

## 11. Fuera de este plan

Carrito, pagos, cuentas, CMS, backend, analítica y selector de tamaño
(Constitución I y VII). Si más adelante se quiere medir los clics en
WhatsApp, se puede agregar una analítica ligera y sin cookies.
