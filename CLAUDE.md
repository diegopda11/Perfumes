# Proyecto: Catálogo de Decants de Perfume (nombre placeholder: "Essence Maison" — pendiente de reemplazo por un nombre acorde a la identidad propia)

> Metodología: spec-driven development. Antes de escribir código, leer
> `specs/constitution.md` y la spec vigente en `specs/`.

## Qué es este proyecto

Sitio web de catálogo para un negocio LOCAL de reventa de perfumes fraccionados
(decants) de 10ml. El sitio NO vende directamente — no hay carrito, no hay
checkout, no hay pasarela de pagos, no hay envíos gestionados por la web.
Toda venta se cierra por WhatsApp fuera del sitio.

El propósito del sitio es 100% exhibición/catálogo + generar contacto por
WhatsApp. Es esencialmente un "showroom digital".

## Modelo de negocio (contexto para tomar decisiones de producto/diseño)

- Se compran perfumes originales completos (100ml, etc.) y se venden
  fraccionados en decants de 10ml.
- Por ahora, tamaño único: 10ml. (Diseñar sin selector de tamaño, pero sin
  cerrar la puerta a añadirlo después).
- Negocio local de pueblo — no hay envíos nacionales ni logística compleja.
  La entrega y el pago se coordinan directamente por WhatsApp.
- Autenticidad es importante pero NO debe ser el mensaje protagonista.
  Se comunica de forma sutil (ej. un sello pequeño "100% original" en la
  tarjeta de producto), no con una sección grande dedicada a "probar" que
  es original.
- Catálogo inicial real: 1-2 perfumes. PERO la página debe diseñarse/maquetarse
  pensando en un catálogo más grande (usar datos de ejemplo/placeholder para
  ver cómo se comporta el grid con más productos).

## Estética / dirección de diseño

Referencia de inspiración: hero de "Élavier" (perfumería de lujo francesa).
IMPORTANTE: es inspiración, NO un clon. Se toman principios, no elementos
literales (ni su composición, ni objetos escenográficos, ni su copy). La
identidad debe ser propia y nacer del negocio real: lujo cercano y local,
vendido en formato decant de 10 ml. Ver `specs/constitution.md` (III-bis) y
`specs/001-catalogo-mvp/spec.md` (sección 6-bis).

Principios a tomar como inspiración:

- Fondo oscuro (azul/negro profundo) con iluminación dramática tipo spot
  light cayendo sobre el frasco, como si estuviera en una vitrina de joyería.
- Frasco de perfume centrado, gigante, como protagonista absoluto.
- Texto de marca enorme en tipografía serif elegante, semi-detrás del
  producto, dando profundidad (no compite visualmente con el frasco).
- Detalles dorados / cobre como acento de lujo (marco, líneas, texto).
- Carrusel horizontal con flechas sutiles a los lados, productos borrosos
  parcialmente visibles en los extremos (insinúa "hay más para explorar").
- Tarjeta flotante de producto (glassmorphism/semi-transparente) en una
  esquina del hero: nombre del perfume, notas olfativas breves, tamaño
  (10ml), precio.
- Nav superior simple: logo, links (Catálogo / Nosotros / Contacto), CTA.
- Tono general: MUY lujoso y exclusivo — no minimalista casual, no
  "ecommerce genérico". Debe sentirse premium, a la altura de una boutique
  de alta perfumería, aunque el negocio sea local y pequeño — sin imitar
  poses francesas/parisinas.

Paleta de colores: aún no definida — usar algo cercano a azul marino /
negro + dorado como punto de partida, pero dejar el sistema de diseño
flexible para poder ajustar paleta fácilmente (usar variables CSS /
design tokens, no colores hardcodeados).

## Estructura de páginas

1. **Home / Hero**
   - Hero tipo vitrina con carrusel de perfumes destacados (inspirado en
     los principios de la referencia, con identidad propia).
   - Sección de catálogo/grid debajo: tarjetas con foto oficial de marca,
     nombre, marca, precio del decant (10ml), 2-3 notas olfativas breves.
     SIN botón de WhatsApp en la tarjeta (solo se ve el producto, clic
     lleva al detalle).
   - Sección "Cómo funciona" / "Sobre nosotros" — importante para negocio
     local: explica el proceso (ves el producto → escribes por WhatsApp →
     coordinan pago y entrega en persona/local). Da confianza de que es
     un negocio real y cercano.

2. **Detalle de producto** (`/producto/[slug]`)
   - Foto oficial de marca (frasco completo, para reconocimiento).
   - Foto real del decant de 10ml que efectivamente se entrega (importante:
     debe quedar claro que se vende una FRACCIÓN, no el frasco completo).
   - Info completa: marca, notas de salida/corazón/fondo, concentración
     (EDP/EDT/Extrait), precio del decant de 10ml.
   - Mención sutil de autenticidad (no protagonista).
   - Botón CTA principal: "Consultar por WhatsApp" — abre wa.me con
     mensaje precargado tipo:
     `Hola, me interesa el decant de 10ml de [Nombre del Perfume]`
   - Este es el ÚNICO lugar del sitio con botón de WhatsApp.

## Reglas de producto / restricciones importantes

- NO implementar carrito de compras.
- NO implementar checkout ni pasarela de pago.
- NO implementar formulario de envío/dirección.
- El único "conversion point" del sitio es el botón de WhatsApp en el
  detalle de producto.
- Usar datos de ejemplo (mock data / JSON local) para simular un catálogo
  más grande, aunque el negocio real arranque con 1-2 productos.
- Usar nombre de marca genérico/placeholder por ahora (fácil de cambiar
  después vía config o variable de entorno / archivo de constantes).
- Fotos de producto en catálogo/hero = fotos oficiales de marca (asumir
  que se usarán imágenes provistas por el dueño del negocio o de uso
  autorizado — no generar ni scrapear imágenes con derechos de marca).
- Foto del decant = foto propia (tomada por el negocio), distinta del
  frasco oficial.

## Stack técnico sugerido

- Next.js (App Router) + TypeScript
- Tailwind CSS para estilos, con design tokens/variables para poder
  ajustar la paleta de colores fácilmente más adelante
- Componentes reutilizables: ProductCard, ProductCarousel, ProductDetail,
  WhatsAppButton
- Mock data en JSON/TS (ej. `data/products.ts`) fácil de editar a mano
  mientras no hay backend/CMS
- Imágenes optimizadas con `next/image`
- Responsive-first: el negocio es local, muchos clientes probablemente
  entrarán desde el celular

## Notas de tono/copy

- Copy en español, cercano pero elegante — no tan formal como una marca
  de lujo francesa real, pero tampoco casual/informal.
- Las notas olfativas (salida/corazón/fondo) deben sonar evocadoras y
  ayudar a "vender" el aroma sin poder olerlo (como el copy "Dark woods.
  Smoked vanilla. Magnetic depth." del ejemplo de referencia).

## Next.js

@AGENTS.md
