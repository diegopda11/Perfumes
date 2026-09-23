import Link from "next/link";
import { site } from "@/config/site";
import { MobileMenu } from "./MobileMenu";

export const navLinks = [
  { href: "/#catalogo", label: "Catálogo" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#contacto", label: "Contacto" },
] as const;

/** Barra superior (CA-6.1, CA-6.2). Flota sobre el hero. */
export function SiteNav() {
  return (
    <header data-intro="ui" className="absolute inset-x-0 top-0 z-30">
      <nav
        aria-label="Principal"
        className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 md:px-10 md:py-7"
      >
        <Link href="/" translate="no" className="font-display text-[22px] leading-none md:text-[26px]">
          {site.brandName}
        </Link>

        <ul className="hidden items-center gap-10 text-[15px] text-text/80 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="transition-colors hover:text-text">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/#catalogo"
          className="hidden rounded-full border border-accent-lit/50 px-5 py-2.5 text-[15px] text-accent-lit transition-colors hover:border-accent-lit hover:bg-accent-lit/10 md:inline-flex"
        >
          Explorar colección
        </Link>

        <MobileMenu links={navLinks} />
      </nav>
    </header>
  );
}
