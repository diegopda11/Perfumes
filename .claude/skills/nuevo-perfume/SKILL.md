---
name: nuevo-perfume
description: Agrega un perfume nuevo al catálogo de Fracción de principio a fin, a partir de la foto del dueño y el nombre del perfume. Investiga notas y descripción con fuentes confiables, recorta frasco y decant, lo agrega al catálogo y al hero, corre las pruebas y guarda los cambios. Úsalo cuando el dueño pida agregar, subir o dar de alta un perfume nuevo.
argument-hint: <marca y nombre del perfume> [precio] [ruta de la foto]
---

# Agregar un perfume nuevo

Proceso completo para dar de alta un perfume. Sigue los pasos en orden y no
te saltes ninguno: el dueño depende de que cada perfume quede igual de bien
que los anteriores. Habla con el dueño en español, en lenguaje sencillo.

Antes de empezar, lee `specs/constitution.md` (en especial IV e IV-bis) y la
sección "Agregar o editar un perfume" de `README.md`.

## 0. Qué necesitas del dueño

- **Nombre y marca** del perfume (viene en los argumentos o en el mensaje).
- **Foto**: una escena con el frasco completo y su decant de 10 ml, como las
  de `photos-raw/`. Opcional: una segunda foto solo del frasco, limpia.
  Las imágenes que el dueño adjunta en el chat quedan en la carpeta temporal
  de imágenes de la sesión; búscalas ahí.
- **Precio** del decant de 10 ml. Si no lo da, usa uno provisional y dilo
  claramente al final (no lo inventes como si fuera real).
- **¿Va en el hero?** Por defecto sí (`featured: true`).

Si falta el nombre o la foto, pídelo antes de seguir. Lo demás tiene valor
por defecto.

## 1. Revisar la foto antes de usarla

Mira la imagen y comprueba:

- **La etiqueta del decant dice el mismo perfume** (nombre y, si aparece,
  concentración). Si dice otro perfume, **detente y avísale al dueño**: la
  constitución exige que el decant mostrado sea el que se entrega. Ya pasó
  una vez (un decant rotulado "Wanted by Night" junto a un frasco de "The
  Most Wanted").
- **El frasco corresponde al perfume** (forma y color conocidos de la marca).
- **Hay adornos delante del frasco o piso que refleja**: se puede resolver
  (paso 4), pero anótalo.

## 2. Investigar con fuentes confiables (obligatorio)

Todo lo que se publique sobre el perfume debe estar respaldado
(Constitución IV-bis). Usa WebSearch; los sitios oficiales suelen bloquear la
lectura automática, así que apóyate en lo que la marca publica y confírmalo
en al menos otra fuente. Si una página muestra una verificación anti-bots,
no intentes saltarla: usa otra fuente.

Reúne:

| Dato | Fuente preferida | Confirmar con |
|---|---|---|
| Notas de salida, corazón y fondo | Página oficial de la marca | Fragrantica, Parfumo o minoristas (Sephora, Ulta, Macy's) |
| Familia olfativa | Cómo la describe la marca | Fragrantica / Parfumo |
| Perfumista(s) y año de lanzamiento de **esta** concentración | Marca o prensa | Fragrantica, Parfumo, Wikipedia |
| Concepto / inspiración | Descripción oficial de la marca | Otra fuente que lo cite |
| Concentración | Etiqueta del decant del dueño | Página de la marca |

Reglas:
- Si las fuentes no coinciden, manda la marca.
- Si un dato no se puede respaldar, **no se publica** (no hay "Ideal para"
  a menos que la marca lo diga).
- Cuidado con las versiones: EDT, EDP, Intense, Parfum y Elixir son perfumes
  distintos con notas distintas. Verifica que hablas de la misma.

## 3. Escribir el contenido (español de México)

- **Descripción**: 2-3 oraciones, redactadas con palabras propias a partir
  de cómo la marca presenta el perfume. Nunca copies el texto de la marca.
  Empieza por el concepto o la familia según la marca y recorre las notas en
  orden.
- **tagline**: una frase corta con las notas principales, evocadora pero
  factual (ej. "Lavanda de Francia y azahar de Marruecos sobre vainilla de
  Madagascar.").
- **highlightNotes**: 2 o 3 notas, las más reconocibles.
- **notes**: listas `top`, `heart`, `base`. Incluye el origen solo si la marca
  lo menciona ("Bergamota de Calabria").
- **family**: usa la clave que corresponde a cómo la describe la marca:

  | La marca dice | Clave |
  |---|---|
  | ámbar, oriental, ambarado | `oriental` (se muestra "Ámbar") |
  | floral | `floral` |
  | chipre | `chipre` |
  | amaderado | `amaderado` |
  | aromático, fougère | `aromatico` |
  | cítrico | `citrico` |
  | fresco, acuático | `fresco` |
  | gourmand, dulce | `gourmand` |

  Si la marca combina varias ("fougère amaderado ambarado"), elige la
  dominante y explícalo en la descripción.
- **profile** (para "Encuentra tu perfume"): `moment` (`dia`, `noche` o
  `siempre`) y `character` (`fresco`, `floral`, `calido`, `especiado`),
  deducidos de la familia y del lenguaje de la marca. No se muestra como
  dato; es solo para recomendar.
- **atmosphere** (colores de su página): `base` oscuro (el texto claro debe
  mantener contraste AA; usa tonos con luminosidad similar a `#0b1a33`,
  `#2a1611`, `#241a08`, `#1c0f0b`) y `glow` inspirado en el frasco o el
  jugo del perfume.
- **sources**: 2-4 enlaces reales que usaste, con etiqueta "Marca: Nombre".

## 4. Imágenes

1. Define el `slug`: `marca-nombre-concentracion` en minúsculas y con
   guiones (ej. `azzaro-the-most-wanted-edp-intense`).
2. Convierte la escena a PNG y guárdala como `photos-raw/<slug>.png`. Si hay
   foto limpia solo del frasco, guárdala como `photos-raw/<slug>.frasco.png`
   (el frasco saldrá de ella y el decant de la escena).
3. Agrega primero la entrada del perfume a `data/products.ts` (paso 5): el
   script lee de ahí el nombre para la imagen de compartir.
4. Corre `npm run images` (usa el entorno `scripts/photos/.venv`; si no
   existe, créalo según el README).
5. **Revisa `photos-out/<slug>/review.png`**:
   - Si se pegaron adornos o el reflejo del piso, mide las coordenadas en la
     foto original y agrega cajas `keep` en `scripts/photos/overrides.json`;
     vuelve a correr el script.
   - Si algo tapa el frasco (hojas, flores delante), no se puede recuperar:
     pide al dueño una foto limpia solo del frasco.
6. Revisa `public/products/<slug>/og.jpg` (vista previa para WhatsApp).

## 5. Agregar al catálogo

Añade la entrada al final de `products` en `data/products.ts`, con esta
forma (orden de campos igual a los demás):

```ts
{
  slug: "...",
  name: "...",
  brand: "...",
  concentration: "EDP", // EDT | EDP | Extrait | Parfum
  family: "...",
  gender: "...", // femenino | masculino | unisex
  tagline: "...",
  description: "...",
  highlightNotes: ["...", "...", "..."],
  perfumer: "...",
  year: 0,
  sources: [{ label: "...", url: "..." }],
  notes: { top: [], heart: [], base: [] },
  presentations: [{ ml: 10, price: 0 }],
  images: {
    bottle: "/products/<slug>/bottle.webp",
    decant: "/products/<slug>/decant.webp",
    scene: "/products/<slug>/scene.webp",
  },
  atmosphere: { base: "#......", glow: "#......" },
  profile: { moment: "...", character: ["..."] },
  featured: true,
},
```

## 6. Comprobar

1. `npx tsc --noEmit`, `npm run lint` y `npm test` (valida datos e imágenes).
2. Reinicia el servidor de desarrollo si estaba corriendo (guarda en caché
   la lista de páginas y daría 404 en la página nueva).
3. Mira el resultado con capturas (`node scripts/shot.mjs <url> <salida.png>
   1440 900 --reduced`): el perfume en el hero (usa las flechas), su tarjeta
   en el catálogo y su página completa, incluida "Lo que recibes". Revisa
   también en celular (390×844).
4. `npm run test:e2e`. Las pruebas calculan los conteos desde el catálogo,
   así que no deberían necesitar cambios; si alguna falla, investiga la causa
   en vez de ajustar el número.

## 7. Guardar y avisar

1. Haz commit con un mensaje como `Nuevo perfume: <Nombre> de <Marca>`.
2. Responde al dueño en español sencillo:
   - qué se agregó y dónde aparece;
   - los datos clave (notas, perfumista, año) y la lista de fuentes con enlaces;
   - lo que quedó provisional (precio) o cualquier problema de la foto;
   - cómo publicarlo: el dueño sube el sitio a mano, así que debe correr
     `npm run publicar` (construye y abre la carpeta `out`) y arrastrar esa
     carpeta a Netlify (Deploys → zona de arrastre).
