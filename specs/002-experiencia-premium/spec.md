# Spec 002 — Experiencia premium

- **Estado:** Implementada (2026-09-23)
- **Origen:** revisión de ganadores de Awwwards (Cartier *Le Chœur des
  Pierres*, Sobha Privy Collection, Maison des Elites, Abel). Se toman
  principios, no elementos (Constitución III-bis).
- **Restricción dura:** Lighthouse en celular ≥ 90 (RNF-2) y
  `prefers-reduced-motion` respetado en todo.

## Qué se agrega y por qué

| # | Mejora | Principio tomado | Nuestra versión |
|---|---|---|---|
| 1 | Atmósfera por perfume | Ritmo de color por sección (Maison des Elites) | Cada detalle se tiñe con la paleta de su perfume y las notas aparecen por etapas al bajar |
| 2 | El frasco viaja entre páginas | Continuidad de objeto | El frasco del catálogo o del hero se transforma en la vitrina del detalle |
| 3 | Entrada propia | Un solo momento orquestado al cargar | La fracción se llena: una línea de latón dibuja el vial y se llena a 10 ml; luego se enciende la luz y sube el frasco |
| 4 | Luz viva | Producto que responde | El haz y el brillo del vidrio siguen levemente al puntero o la inclinación del celular |
| 5 | Hero que reacciona al scroll | Profundidad por capas | El frasco sube y el wordmark se mueve más lento |
| 6 | Corte de color | Contraste oscuro/claro (Sobha) | "¿Por qué un decant?" en una sección clara perla |
| 7 | Encuentra tu perfume | Buscador de fragancias (Abel) | 3 preguntas tocables → 1-2 recomendaciones con enlace al detalle |
| 8 | Ilustraciones de notas | Evocar sin oler (Abel) | Line art de latón por nota, si alcanza calidad suficiente |

## Criterios de aceptación

- CA-P1.1 Cada perfume real tiene `atmosphere` (base y resplandor). El
  detalle usa esos colores de fondo; el texto mantiene contraste AA.
- CA-P1.2 En el detalle, salida, corazón y fondo aparecen en secuencia al
  entrar en pantalla. Sin soporte de animaciones por scroll o con movimiento
  reducido, se ven completas desde el inicio.
- CA-P2.1 CUANDO el visitante abre un perfume desde el catálogo o desde el
  frasco del hero, el frasco se transforma en el de la vitrina del detalle.
  Sin soporte del navegador, la navegación funciona igual, sin animación.
- CA-P3.1 La entrada se reproduce cada vez que se abre la portada (carga
  completa), dura ≈ 3.2 s, cualquier toque, tecla o scroll la salta, no
  bloquea la interacción y no aparece con movimiento reducido.
  *(Cambio 2026-09-23, pedido del dueño: antes era una vez por sesión y
  1.8 s; con el sitio ya en Netlify no se llegaba a ver.)*
- CA-P3.2 El wordmark es visible desde el primer instante (es el elemento
  LCP); la entrada no debe retrasar el LCP.
- CA-P4.1 La luz se mueve como máximo unos grados; se desactiva con
  movimiento reducido. En celular solo usa la inclinación si el navegador la
  da sin pedir permiso.
- CA-P5.1 Al bajar desde el hero, el frasco sube y el wordmark se desplaza
  más lento, solo con CSS nativo; sin soporte, el hero queda estático.
- CA-P6.1 La sección clara mantiene contraste AA en todos sus textos.
- CA-P7.1 El buscador pregunta para quién, cuándo y qué carácter; recomienda
  1-2 perfumes disponibles; cada respuesta es un control accesible con
  teclado; se puede reiniciar.
- CA-P7.2 La lógica de recomendación tiene pruebas unitarias.
- CA-P7.3 El buscador no abre WhatsApp: lleva a la página del perfume
  (se mantiene CA-4.4).

## Plan técnico (resumen)

- **1:** campo `atmosphere` en `Product`; variables CSS `--atm-base` y
  `--atm-glow` en el `<main>` del detalle; notas con
  `animation-timeline: view()` dentro de `@supports`.
- **2:** `<ViewTransition name="bottle-<slug>" share="morph">` de React en la
  tarjeta, el frasco activo del hero y la vitrina del detalle. Para no
  repetir nombres en la portada, un pequeño estado global "armado" decide
  si el nombre lo lleva el hero o la tarjeta, según qué se tocó.
- **3:** script en línea en `<head>` que marca `html.intro` antes del primer
  pintado (solo primera visita de la sesión y sin movimiento reducido);
  animaciones CSS encadenadas; se usan las propiedades individuales
  `translate`/`scale` para no chocar con las transformaciones del carrusel.
- **4:** `pointermove` (y `deviceorientation` sin permiso) con
  `requestAnimationFrame` → variables `--lx`/`--ly` en el hero.
- **5:** `animation-timeline: scroll()` sobre contenedores del hero.
- **6:** tokens semánticos de sección clara (`--color-paper`, tinta y latón
  oscuro para contraste).
- **7:** campo `profile` en `Product`; `lib/finder.ts` puntúa género,
  momento y carácter; componente cliente con `radio` estilizados.
- **8:** SVG en línea por nota, en `components/notes/`.

## Tareas

- [x] P1 Atmósfera y notas por etapas (línea de latón que se llena al bajar)
- [x] P2 Transición del frasco entre páginas (catálogo, hero y relacionados)
- [x] P3 Entrada "la fracción se llena" (≈ 3.2 s, en cada apertura de la portada, se salta con cualquier interacción)
- [x] P4 Luz viva (puntero; inclinación en Android)
- [x] P5 Hero con scroll
- [x] P6 Sección clara
- [x] P7 Encuentra tu perfume (+ 9 pruebas unitarias)
- [ ] P8 Ilustraciones de notas — **descartado por ahora**: hechas a mano en
  código se verían por debajo de la calidad fotográfica del resto del sitio.
  Recomendado: encargarlas a un ilustrador o fotografiar los ingredientes.
- [x] P9 Pruebas e2e (45 en verde), Lighthouse 100/100/100/100 en celular
  (portada y detalle) y revisión de animaciones

## Notas de implementación

- La vuelta atrás del navegador no anima el frasco: Next no envuelve esa
  navegación en una transición. El resto de navegaciones sí.
- La luz viva por inclinación no funciona en iPhone: iOS exige pedir permiso
  y no se pide a propósito (sería una ventana intrusiva).
- El wordmark nunca se oculta en la entrada; por eso el LCP mejoró (1.7 s).
