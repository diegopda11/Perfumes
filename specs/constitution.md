# Constitución del proyecto — Essence Maison

Principios no negociables. Toda spec, plan y tarea debe respetarlos.
Si una decisión los contradice, se cambia la constitución explícitamente
(con fecha y motivo) o se cambia la decisión — nunca se ignoran en silencio.

## I. Showroom, no tienda
El sitio exhibe y genera contacto. No existe carrito, checkout, pasarela de
pago, cuentas de usuario ni formularios de envío/dirección. La venta se
cierra fuera del sitio, por WhatsApp.

## II. Un único punto de conversión
El botón "Consultar por WhatsApp" vive solo en el detalle de producto y
siempre lleva contexto (qué perfume, qué tamaño). Ningún otro componente
abre WhatsApp.

## III. Lujo como requisito funcional
La estética de boutique (fondo profundo, luz dramática, serif, acentos
dorados) no es decoración opcional: es parte de la propuesta de valor.
Un componente que "funciona" pero se ve genérico no está terminado.

## III-bis. Inspiración, no imitación
Las referencias visuales (p. ej. el hero de Élavier) aportan *principios*,
no elementos para copiar. Ningún layout, composición, objeto escenográfico
ni frase de una referencia se reproduce literalmente. La identidad debe ser
propia y nacer del negocio real: un negocio local en México que vende el
lujo en formato de 10 ml.

## IV. Honestidad sobre el producto
Siempre debe quedar claro que se vende un decant de 10 ml, no el frasco
completo. La autenticidad se comunica de forma sutil, nunca como
protagonista. No se sugiere afiliación con las marcas originales.

## V. Mobile-first
Se diseña y valida primero a 375 px de ancho. El escritorio es la
ampliación, no al revés.

## VI. Contenido editable sin programar
Productos, textos de marca, número de WhatsApp, moneda y paleta se
cambian editando datos o tokens en un solo lugar — nunca buscando valores
hardcodeados en componentes.

## VII. Preparado para crecer, construido para hoy
El modelo de datos admite más tamaños y más productos sin reescritura,
pero no se construye UI ni infraestructura para necesidades que aún no
existen (sin CMS, sin backend, sin selector de tamaño por ahora).

## VIII. Rendimiento y accesibilidad como criterio de aceptación
Imágenes optimizadas, páginas estáticas cuando sea posible, carrusel
operable con teclado y respetando `prefers-reduced-motion`, contraste
de texto AA sobre fondos oscuros.
