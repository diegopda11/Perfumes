# Spec 003 — Decants de 5 ml

- **Estado:** Implementada (2026-10-26)
- **Origen:** pedido del dueño: además del decant de 10 ml, ahora vende
  decants de 5 ml.
- **Enmienda:** Constitución IV y VII (ver la nota con fecha en cada una).

## Qué cambia y por qué

El sitio solo mostraba el decant de 10 ml. Quien quería algo más chico no
sabía que existía ni podía pedirlo por WhatsApp. Ahora cada perfume puede
tener dos tamaños, 10 ml y 5 ml, cada uno con su precio.

| # | Dónde | Qué se ve |
|---|---|---|
| 1 | Datos (`data/products.ts`) | `price` sigue siendo el de 10 ml; `price5ml` (opcional) agrega el de 5 ml |
| 2 | Detalle del perfume | Se elige el tamaño (10 ml de entrada); precio, WhatsApp y "Lo que recibes" lo siguen |
| 3 | Tarjetas y hero | Los dos precios juntos: "10 ml $220 · 5 ml $130 MXN" |
| 4 | Textos generales | "decants de 5 y 10 ml", calculado desde los datos |

## Precios iniciales (MXN)

| Perfume | 10 ml | 5 ml |
|---|---|---|
| The Most Wanted Intense (Azzaro) | 220 | 130 |
| Club de Nuit Urban Man Elixir (Armaf) | 180 | 100 |
| Nitro Red (Dumont) | 150 | 90 |
| Qaed Al Fursan (Lattafa) | 130 | 80 |

## Criterios de aceptación

- CA-1.1 Un perfume sin `price5ml` se comporta igual que antes: solo
  10 ml, sin selector.
- CA-1.2 Con `price5ml`, el perfume tiene dos presentaciones: primero 10 ml
  y después 5 ml. Si se escribe `presentations` a mano, eso manda.
- CA-2.1 CUANDO un perfume tiene dos o más tamaños, su página muestra una
  elección de tamaño accesible (radios reales con forma de píldora, dentro de
  un grupo con nombre "Tamaño del decant"), con 10 ml elegido de entrada.
- CA-2.2 El precio grande y el texto "por un decant de N ml" siguen el
  tamaño elegido.
- CA-2.3 El mensaje de WhatsApp nombra el tamaño elegido:
  `Hola, me interesa el decant de {ml}ml de {Nombre} de {Marca}`. El aviso de
  agotado también usa el tamaño elegido.
- CA-2.4 La barra fija del celular muestra el precio y el tamaño elegidos y
  su botón manda el mismo mensaje.
- CA-2.5 "Lo que recibes" habla del tamaño elegido y no afirma que solo
  existe el de 10 ml.
- CA-3.1 Las tarjetas del catálogo muestran todos los precios cuando hay más
  de un tamaño; con uno solo se ven como antes ("$220 MXN por 10 ml").
- CA-3.2 La tarjeta de vidrio del hero y el texto del hero en celular hacen
  lo mismo.
- CA-4.1 Los textos que describen la oferta (titular de la portada,
  catálogo, "¿Por qué un decant?", pie de página, descripción para buscadores
  y vistas previas) nombran los tamaños que existen en los datos.
- CA-4.2 WhatsApp sigue siendo el único punto de conversión y solo vive en
  la página del perfume (CA-4.4 de la spec 001).

## Plan técnico (resumen)

- `lib/presentations.ts`: `toPresentations` (de `price`/`price5ml` a
  `presentations`), `formatSizes`, `formatPriceList`, `catalogSizes`.
- `components/product/SizeContext.tsx`: estado compartido del tamaño en el
  detalle (precio, WhatsApp, barra fija y "Lo que recibes").
- `components/product/PriceBlock.tsx`: elección de tamaño y precio.
- Pruebas: unitarias de mapeo, formato y mensaje; e2e de la elección de
  tamaño, la barra fija y las tarjetas, con valores sacados del catálogo.

## Pendiente

- Foto del decant de 5 ml. Las escenas actuales muestran el de 10 ml; la
  constitución pide que el decant mostrado sea el que se entrega, así que
  conviene fotografiar también el de 5 ml cuando el dueño lo tenga.
