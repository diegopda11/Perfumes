import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Instrument_Sans } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { site } from "@/config/site";
import "./globals.css";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

// Cada vez que se abre la portada (carga completa, no al volver desde otra
// página del sitio), salvo que el visitante prefiera menos movimiento.
const introScript = `try{if(["/","/index","/index.html"].includes(location.pathname)&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.classList.add("intro")}}catch(e){}`;

const description = `Decants de 10 ml de perfumes originales en ${site.locality}. Prueba el lujo sin comprar el frasco completo.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.brandName} · Decants de perfumes originales`,
    template: `%s · ${site.brandName}`,
  },
  description,
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: site.brandName,
    title: `${site.brandName} · Decants de perfumes originales`,
    description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${site.brandName}: decants de 10 ml` }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0c1426",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-MX" className={`${bodoni.variable} ${instrument.variable}`} suppressHydrationWarning>
      <head>
        {/* Decide antes del primer pintado si corre la entrada (spec 002, P3) */}
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="flex min-h-svh flex-col">
        <a
          href="#contenido"
          className="sr-only z-50 rounded-full bg-accent-lit px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Saltar al contenido
        </a>
        <SiteNav />
        <div id="contenido" className="flex-1">
          {children}
        </div>
        <SiteFooter />
      </body>
    </html>
  );
}
