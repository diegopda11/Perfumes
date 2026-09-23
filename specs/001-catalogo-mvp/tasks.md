# Tareas 001 — Catálogo MVP

- **Fecha:** 2026-09-23
- **Entrada:** `plan.md`
- Cada tarea es pequeña, se puede verificar por sí sola y cita los criterios
  que cubre. `[P]` = se puede hacer en paralelo con la anterior.

## Fase 0 — Base del proyecto
- [x] T01 Inicializar git y `.gitignore` (`node_modules`, `.next`, `out`,
      `photos-raw`, `photos-out`, `scripts/photos/.venv`).
- [x] T02 Crear el proyecto Next.js (App Router, TS estricto, Tailwind v4,
      ESLint) y configurar `output: 'export'`. **Verifica:** `npm run build`
      genera `out/`.
- [x] T03 Tokens de diseño en `app/globals.css` (primitivos + semánticos,
      plan §4) y fuentes Bodoni Moda + Instrument Sans con `next/font`.
- [x] T04 [P] `config/site.ts` y `types/product.ts` (plan §3-4).
- [~] T05 [P] `lib/format.ts` (hecho, sin tests) y `lib/whatsapp.ts` con tests de Vitest.
      **Verifica:** RNF-8, CA-4.2, CA-4.5.

## Fase 1 — Imágenes
- [x] T06 Entorno de recorte (`rembg` + BiRefNet) y `scripts/photos/cutout.py`.
- [ ] T07 Limpieza de bordes: base del frasco de Coco Mademoiselle
      (tapada por flores en la escena) y tono del fondo visible a través
      del vidrio de Libre. **Verifica:** CA-IMG.1 en la hoja de revisión.
- [x] T08 Exportar a WebP en dos tamaños y copiar a
      `public/products/<slug>/` (`bottle`, `decant`, `scene`).
- [ ] T09 Repetir T07-T08 con las imágenes en resolución original cuando
      lleguen.

## Fase 2 — Datos
- [~] T10 `data/products.ts` con los 3 perfumes reales (hecho; faltan los mock) (notas del plan §3,
      precios placeholder) y `data/mock-products.ts` con ~12 ficticios.
- [ ] T11 `lib/catalog.ts` (destacados, por slug, relacionados, filtros,
      agotados al final) con tests. **Verifica:** CA-2.5, CA-2.10.
- [ ] T12 Test de validación del catálogo (slugs únicos, notas, precio,
      imágenes existentes).

## Fase 3 — Hero
- [x] T13 `Spotlight` + `Wordmark`: fondo, haz de luz y "Fracción" detrás.
      **Verifica:** CA-1.1, CA-1.10.
- [x] T14 `SiteNav` con cápsula, CTA "Explorar colección" y menú de celular
      accesible. **Verifica:** CA-6.1, CA-6.2.
- [x] T15 `HeroCarousel`: frasco activo, laterales desenfocados, flechas,
      swipe y ←/→, sin avance automático, caso de 1 producto.
      **Verifica:** CA-1.2, CA-1.3, CA-1.7, CA-1.8.
- [x] T16 Transición de entrada del frasco y `prefers-reduced-motion`.
      **Verifica:** CA-IMG.2, CA-1.6.
- [x] T17 `HeroCard` de vidrio con el decant recortado, nombre, notas y
      precio; en celular solo el nombre bajo el frasco. **Verifica:** CA-1.4,
      CA-1.5, CA-1.9.
- [~] T18 Revisión del hero (revisión manual hecha; falta la de las skills) a 375 / 768 / 1440 px con las skills
      `web-design-guidelines`, `accessibility` y `review-animations`.

## Fase 4 — Catálogo
- [ ] T19 `ProductCard` (sello "100% original", vial, sin WhatsApp).
- [ ] T20 `ProductGrid` + `FilterChips` con filtros en la URL y estado vacío.
      **Verifica:** CA-2.1 a CA-2.10.

## Fase 5 — Detalle
- [ ] T21 Página `/producto/[slug]` estática, con 404 para slugs
      desconocidos. **Verifica:** CA-3.1, CA-3.5.
- [ ] T22 `ProductGallery`, `DecantShowcase`, `NotesPyramid`.
      **Verifica:** CA-3.2, CA-3.3.
- [ ] T23 `WhatsAppButton` + `StickyWhatsAppBar` (disponible / agotado).
      **Verifica:** CA-4.1 a CA-4.5.
- [ ] T24 `RelatedProducts`. **Verifica:** CA-3.6.
- [ ] T25 Metadata y Open Graph por perfume. **Verifica:** CA-7.1, CA-7.2.

## Fase 6 — Secciones y cierre
- [ ] T26 `HowItWorks`, `About`, `SiteFooter` (localidad, aviso de marcas).
      **Verifica:** CA-5.1 a CA-5.4, CA-6.3, CA-6.4, RNF-7.
- [ ] T27 Pruebas e2e con Playwright (plan §8).
- [ ] T28 Lighthouse en celular ≥ 90 y correcciones. **Verifica:** RNF-2.
- [ ] T29 Despliegue (hosting por decidir, plan §9).
