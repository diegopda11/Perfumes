# Spec 001 — Catálogo MVP

- **Estado:** Implementada (2026-09-23); ver `tasks.md` para pendientes del dueño
- **Fecha:** 2026-09-23
- **Alcance:** Qué debe hacer el sitio y por qué. Sin decisiones técnicas
  (esas van en `plan.md`).

Todas las clarificaciones están resueltas (ver sección 7).

---

## 1. Problema y objetivo

Un negocio local vende decants de 10 ml de perfumes originales. Hoy no
tiene un lugar donde mostrar el catálogo con una imagen que justifique su
posicionamiento premium. El sitio debe:

1. Transmitir exclusividad (boutique de lujo) desde el primer segundo.
2. Permitir explorar el catálogo y entender cada aroma sin olerlo.
3. Convertir interés en una conversación de WhatsApp con contexto.
4. Dar confianza de que es un negocio real y cercano.

**Métrica de éxito:** clics en "Consultar por WhatsApp" por visita a detalle.

## 2. Actores

- **Visitante** — cliente potencial del pueblo, mayoritariamente en celular,
  a menudo llega desde un enlace compartido por WhatsApp o Instagram.
- **Dueño del negocio** — mantiene el catálogo (sin conocimientos técnicos
  profundos; hoy edita un archivo de datos con ayuda).

## 3. Historias de usuario y criterios de aceptación

Formato de criterios: EARS (*CUANDO / MIENTRAS / SI … ENTONCES el sistema …*).

### HU-1 — Primera impresión (Hero vitrina)
*Como visitante, quiero que la portada me haga sentir en una perfumería de
lujo, para confiar en la calidad de lo que se vende.*

- CA-1.1 CUANDO el visitante carga la home, el sistema muestra un hero a
  pantalla completa con fondo oscuro, un frasco destacado centrado bajo un
  haz de luz y el nombre de la marca en serif grande detrás del frasco.
- CA-1.2 El hero muestra un carrusel de perfumes **destacados**, con el
  anterior y el siguiente visibles parcialmente y desenfocados en los extremos.
- CA-1.3 CUANDO el visitante usa las flechas, desliza (swipe) o usa las
  teclas ←/→, el sistema cambia al perfume anterior/siguiente.
- CA-1.4 El sistema muestra una tarjeta flotante semitransparente con el vial
  de 10 ml, nombre, 2-3 notas breves y precio del perfume activo. El frasco
  grande no lleva ningún indicador de medida.
- CA-1.5 CUANDO el visitante toca el frasco o la tarjeta flotante, el sistema
  navega al detalle de ese perfume.
- CA-1.6 SI el visitante tiene `prefers-reduced-motion`, ENTONCES el carrusel
  no anima transiciones ni avanza solo.
- CA-1.7 El carrusel **no** avanza automáticamente; solo cambia por acción
  del visitante (flechas, swipe o teclado).
- CA-1.9 En celular (< 768 px), el hero muestra solo el frasco como
  protagonista: sin tarjeta de información. La información completa vive en
  la página de producto. Solo se muestra el nombre del perfume, pequeño,
  bajo el frasco, para que se sepa qué es y que se puede tocar.
- CA-1.10 El wordmark de fondo usa por ahora "Fracción" (placeholder), que se
  toma del archivo de configuración de marca.
- CA-1.8 SI hay un solo producto destacado, ENTONCES el hero se muestra sin
  flechas ni productos laterales (sin verse "roto").

### HU-2 — Explorar el catálogo
*Como visitante, quiero ver todos los perfumes disponibles de un vistazo,
para encontrar uno que me interese.*

- CA-2.1 La home incluye una grilla de tarjetas: foto del frasco, nombre, marca,
  precio del decant de 10 ml y 2-3 notas olfativas.
- CA-2.2 Cada tarjeta muestra un sello discreto "100% original".
- CA-2.3 Las tarjetas **no** tienen botón de WhatsApp; toda la tarjeta es un
  enlace al detalle.
- CA-2.4 La grilla es de 1-2 columnas en celular y 3-4 en escritorio, y se ve
  equilibrada con 1, 2, 5 y 20+ productos.
- CA-2.5 SI un producto está agotado, ENTONCES la tarjeta sigue visible y
  navegable, con una etiqueta discreta "Agotado", y se ordena después de los
  disponibles.
- CA-2.6 La grilla vive en la home (sección `#catalogo`); no hay página
  `/catalogo` aparte en este MVP.
- CA-2.7 Sobre la grilla hay chips de filtro por **familia olfativa** y por
  **género** (Femenino / Masculino / Unisex), con "Todos" seleccionado por
  defecto.
- CA-2.8 CUANDO el visitante selecciona un chip, el sistema filtra la grilla
  sin recargar la página y refleja el filtro en la URL (`?familia=amaderado`),
  de modo que un enlace filtrado se puede compartir.
- CA-2.9 SI ninguna combinación de filtros tiene resultados, ENTONCES el
  sistema muestra un mensaje amable y una opción para limpiar filtros.
- CA-2.10 Los chips solo muestran familias que existen en el catálogo actual
  (sin filtros vacíos).

### HU-3 — Entender un perfume (Detalle)
*Como visitante, quiero conocer a fondo un perfume y saber exactamente qué
recibo, para decidir si lo pido.*

- CA-3.1 CUANDO el visitante abre `/producto/[slug]`, el sistema muestra: el
  frasco completo, la escena frasco + decant, foto del decant, marca, nombre, concentración
  (EDP / EDT / Extrait / Parfum), notas de salida, corazón y fondo, precio
  del decant de 10 ml y una descripción evocadora.
- CA-3.2 El sistema deja explícito que se entrega un decant de 10 ml (texto
  + foto del decant), no el frasco completo.
- CA-3.3 El sistema muestra una mención sutil de autenticidad.
- CA-3.4 SI el producto no tiene foto de decant propia, ENTONCES se usa una
  foto genérica del decant del negocio (nunca el frasco completo en su lugar).
- CA-3.5 SI el slug no existe, ENTONCES el sistema muestra una página 404
  con la misma estética y un enlace al catálogo.
- CA-3.6 El detalle sugiere 2-4 perfumes relacionados (misma familia o
  marca) para seguir explorando.

### HU-4 — Consultar por WhatsApp
*Como visitante, quiero escribir al negocio sobre un perfume con un toque,
sin tener que explicar cuál es.*

- CA-4.1 El detalle muestra un botón principal "Consultar por WhatsApp".
- CA-4.2 CUANDO el visitante lo toca, el sistema abre `wa.me/<número>` con el
  mensaje precargado: `Hola, me interesa el decant de 10ml de [Nombre del Perfume]`.
- CA-4.3 En celular, el botón permanece accesible sin hacer scroll hasta el
  final (p. ej. barra fija inferior).
- CA-4.4 Es el único elemento del sitio que abre WhatsApp.
- CA-4.5 SI el producto está agotado, ENTONCES el botón cambia a "Avisarme
  cuando vuelva" (estilo secundario) y abre WhatsApp con el mensaje:
  `Hola, ¿me avisas cuando vuelva a estar disponible el decant de 10ml de [Nombre del Perfume]?`
  El detalle indica "Agotado por ahora" junto al precio.

### HU-5 — Confiar en el negocio (Cómo funciona / Nosotros)
*Como visitante, quiero entender cómo compro y quién está detrás, para
sentirme seguro de pagar.*

- CA-5.1 La home incluye una sección "Cómo funciona" en 3 pasos: eliges tu
  perfume → escribes por WhatsApp → coordinan pago y entrega en persona.
- CA-5.2 Incluye un bloque breve "Sobre nosotros" (qué es un decant, por qué
  permite probar perfumes de lujo sin comprar el frasco completo).
- CA-5.3 Se muestra la localidad: **Higuera de Zaragoza, Sinaloa**. Por ahora
  no hay horario ni Instagram.
- CA-5.4 Horario e Instagram existen como campos opcionales de configuración.
  SI están vacíos, ENTONCES no se muestran (sin huecos ni "próximamente").

### HU-6 — Navegación
- CA-6.1 La barra superior muestra logo, enlaces Catálogo / Nosotros /
  Contacto y un CTA "Explorar colección".
- CA-6.2 En celular, los enlaces se agrupan en un menú desplegable accesible.
- CA-6.3 "Catálogo" y el CTA llevan a `/#catalogo`; "Nosotros" a
  `/#nosotros`; "Contacto" al footer (`#contacto`), que muestra la localidad
  (y horario e Instagram cuando existan) y explica que se pide escribiendo
  desde la página de cada perfume. **Sin** botón de WhatsApp.
- CA-6.4 Desde cualquier página (p. ej. el detalle), los enlaces del nav
  llevan a la sección correspondiente de la home.

### HU-7 — Compartir un perfume
*Como visitante, quiero pasar el enlace de un perfume a alguien por WhatsApp
y que se vea bien.*

- CA-7.1 CUANDO se comparte la URL de un detalle, la vista previa muestra
  imagen, nombre del perfume y precio (Open Graph).
- CA-7.2 La home tiene su propia vista previa con la marca.

### HU-8 — Mantener el catálogo (dueño)
- CA-8.1 Agregar un perfume requiere solo añadir una entrada de datos y sus
  imágenes; no tocar componentes.
- CA-8.2 Marcar un perfume como destacado, agotado o cambiar su precio es
  editar un campo.
- CA-8.3 Nombre de marca, número de WhatsApp, moneda y paleta de colores se
  cambian en un único archivo de configuración/tokens.

## 4. Requisitos no funcionales

- RNF-1 Mobile-first; validado a 375 px, 768 px y 1440 px.
- RNF-2 Lighthouse ≥ 90 en Performance, Accesibilidad y SEO en celular.
- RNF-3 Contraste AA para todo texto sobre fondo oscuro.
- RNF-4 Carrusel operable por teclado y lector de pantalla.
- RNF-5 Copy en español de México: cercano pero elegante.
- RNF-8 Precios en pesos mexicanos, formato `$1,250 MXN` (locale `es-MX`),
  sin centavos. Moneda y locale configurables en un solo lugar.
- RNF-6 Todas las imágenes de producto las provee el dueño y se recortan sin
  fondo. No se usan fotos oficiales de
  las marcas descargadas de internet. Durante el desarrollo se usan frascos
  ilustrados de relleno, claramente marcados.
- RNF-7 Aviso legal discreto en el footer: marcas pertenecen a sus dueños, sin
  afiliación.

## 5. Fuera de alcance (explícito)

Carrito, checkout, pagos, cuentas, envíos, formularios de dirección, CMS,
backend, selector de tamaño, reseñas, blog, multi-idioma.

## 6. Datos de un perfume (conceptual)

| Campo | Obligatorio | Nota |
|---|---|---|
| slug | sí | URL del detalle |
| nombre, marca | sí | |
| concentración | sí | EDP / EDT / Extrait / Parfum |
| notas salida / corazón / fondo | sí | listas |
| notas destacadas | sí | 2-3, para tarjeta y hero |
| tagline evocador | sí | estilo "Maderas oscuras. Vainilla ahumada." |
| descripción | sí | párrafo del detalle |
| presentaciones | sí | lista de {ml, precio}; hoy solo 10 ml |
| foto oficial | sí | idealmente PNG con fondo transparente para el hero |
| foto del decant | no | fallback a foto genérica |
| destacado | no | aparece en el carrusel del hero |
| disponible | no | por defecto sí |
| familia olfativa | sí | de una lista cerrada (amaderado, floral, oriental/ámbar, cítrico, fresco/acuático, gourmand, aromático…) — alimenta los filtros |
| género | sí | Femenino / Masculino / Unisex — alimenta los filtros |

## 6-bis. Referencia visual: qué tomamos y qué no

Referencia: hero de "Élavier" (perfumería de lujo francesa). Es
**inspiración**, no plantilla (ver Constitución III-bis).

**Principios que tomamos**
- Producto en vitrina: un solo objeto protagonista, con luz dramática sobre
  un fondo profundo.
- Profundidad por capas: tipografía grande detrás del producto, elementos
  secundarios desenfocados.
- Contraste de escala: un elemento enorme frente a textos de apoyo pequeños
  y contenidos.
- Base oscura y fría con un acento metálico cálido.
- Información flotante y ligera (vidrio translúcido) que no tapa el producto.
- Contención: pocos elementos, mucho aire, nada que grite "oferta".

**Lo que NO copiamos**
- La seda dorada, el pedestal escalonado, la composición exacta ni la
  posición de flechas, tarjeta y CTA.
- El posicionamiento "PARIS · Haute Parfumerie" y cualquier impostura
  francesa. Nuestro lujo es cercano y local.
- Su wordmark y su tipografía concretas.

**Nuestro diferenciador (a desarrollar en `plan.md`)**
Élavier vende frascos; nosotros vendemos el **decant**. La identidad puede
girar en torno a eso: el vial de 10 ml, el ritual de fraccionar, "probar el
lujo sin comprometerse con el frasco completo". Antes de maquetar se
elegirá una dirección de identidad propia.

## 7. Clarificaciones

### 2026-09-23
- **Nav/Contacto:** CTA "Explorar colección" → catálogo; "Contacto" → footer
  sin WhatsApp. Se mantiene la regla de un único punto de conversión.
- **Agotados:** se muestran con etiqueta; en el detalle, el botón pasa a
  "Avisarme cuando vuelva" (WhatsApp con mensaje específico).
- **Catálogo:** grilla en la home con chips de familia olfativa y género;
  sin página `/catalogo`.
- **Moneda:** MXN, locale `es-MX`.
- **Referencia visual:** Élavier es inspiración, no algo a clonar. Buscamos
  identidad propia (sección 6-bis).
- **Identidad:** dirección "Fracción" (ver `identidad.md`). El frasco oficial
  va limpio, sin escala de medida. El vial de 10 ml aparece en la tarjeta de
  información (hero, catálogo y detalle) como firma visual.
- **Carrusel:** sin auto-avance.
- **Localidad:** Higuera de Zaragoza, Sinaloa. Sin horario ni Instagram por
  ahora (campos opcionales, ocultos si están vacíos).
- **Celular:** el hero muestra solo el frasco, sin tarjeta; se adopta la
  propuesta de mostrar el nombre pequeño bajo el frasco.
- **Fotos:** no se descargan fotos oficiales de internet. Se usan las
  imágenes que provee el dueño, recortadas sin fondo.
- **3D / 360°:** descartados. Se usan imágenes provistas por el dueño
  (frasco + decant), recortadas (ver 7-ter).

## 7-bis. Catálogo real inicial

Identificados a partir de fotos de referencia del dueño (esas fotos **no** se
usan en el sitio):

| Perfume | Marca | Concentración | Por confirmar |
|---|---|---|---|
| Sauvage | Dior | Eau de Parfum (visible en el frasco) | — |
| Coco Mademoiselle | Chanel | Eau de Parfum (probable) | Existen EDT, Intense y L'Eau Privée; confirmar con la caja |
| Libre | Yves Saint Laurent | Eau de Parfum (probable) | Existen Intense y Le Parfum; confirmar con la caja |

Con 3 destacados, el carrusel del hero funciona completo desde el arranque.

## 7-ter. Imágenes de producto

**Decisión (2026-09-23):** sin 3D ni giro de 360°. Se descartaron ambos.
El dueño provee una imagen por perfume: una escena con el frasco completo
junto a su decant de 10 ml.

De cada imagen salen tres piezas:
- **Frasco recortado** (sin fondo): protagonista del hero y foto de las
  tarjetas del catálogo.
- **Decant recortado** (sin fondo): va en la tarjeta de información del hero
  en lugar del vial ilustrado, y en el detalle.
- **Escena completa** (frasco + decant juntos): en el detalle, deja claro de
  un vistazo qué se entrega frente al frasco original (CA-3.2).

- CA-IMG.1 El recorte no muestra halos, restos de fondo ni bordes dentados,
  sobre todo en el vidrio y las tapas, visto sobre el fondo `ink`.
- CA-IMG.2 En el hero, al cambiar de perfume, el frasco entra con una
  transición sutil (sin giro). Con `prefers-reduced-motion`, cambia sin
  animar.

## 8. Pendientes (no bloquean el plan)

1. Precios de venta de cada decant (se usan placeholders mientras tanto).
2. Confirmar la concentración de Coco Mademoiselle y Libre con la caja.
3. Imágenes en resolución original (las recibidas miden ~430×1024 px).
4. Nombre definitivo del negocio (el wordmark usa "Fracción" por ahora).
