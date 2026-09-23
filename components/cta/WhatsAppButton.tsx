import { displayName, isAvailable } from "@/lib/catalog";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { Product } from "@/types/product";

interface Props {
  product: Product;
  size?: "large" | "compact";
  className?: string;
}

/**
 * El único punto de conversión del sitio (CA-4.1 a CA-4.5). Si el perfume
 * está agotado, pasa a "Avisarme cuando vuelva" con estilo secundario.
 */
export function WhatsAppButton({ product, size = "large", className = "" }: Props) {
  const available = isAvailable(product);
  const href = buildWhatsAppUrl(displayName(product), available ? "consulta" : "aviso");
  const label = available ? "Consultar por WhatsApp" : "Avisarme cuando vuelva";

  const sizing = size === "large" ? "h-14 px-7 text-base" : "h-12 px-5 text-[15px]";
  const tone = available
    ? "bg-accent-lit text-bg hover:bg-pearl"
    : "border border-accent-lit/60 text-accent-lit hover:bg-accent-lit/10";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-whatsapp
      className={`inline-flex items-center justify-center gap-2.5 rounded-full font-medium transition-[color,background-color,border-color,scale] active:scale-[0.97] ${sizing} ${tone} ${className}`}
    >
      <ChatIcon />
      {label}
      <span className="sr-only"> (se abre WhatsApp)</span>
    </a>
  );
}

function ChatIcon() {
  return (
    <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M4.5 19.5 5.6 16A8 8 0 1 1 8.4 18.6z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M9 11.5h.01M12 11.5h.01M15 11.5h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
