import type { Metadata } from "next";
import { Bodoni_Moda, Instrument_Sans } from "next/font/google";
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

export const metadata: Metadata = {
  title: `${site.brandName} · Decants de perfumes originales`,
  description: `Decants de 10 ml de perfumes originales en ${site.locality}. Prueba el lujo sin comprar el frasco completo.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-MX" className={`${bodoni.variable} ${instrument.variable}`}>
      <body className="min-h-svh">
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
