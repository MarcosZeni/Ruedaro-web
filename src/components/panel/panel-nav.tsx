"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export type PanelNavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  /** Otras rutas que también marcan esta opción como activa (pestañas de una misma sección). */
  match?: string[];
};

const coincide = (pathname: string, ruta: string) => pathname === ruta || pathname.startsWith(`${ruta}/`);

/**
 * Navegación del panel. Mismos destinos en dos formatos:
 * - Celular: barra fija abajo, con ícono y texto, como las apps que la gente ya
 *   usa (WhatsApp, Mercado Libre). Queda al alcance del pulgar.
 * - Escritorio: pestañas en el header.
 *
 * Marca como activa la opción cuya ruta coincide más largo: en
 * /mis-pedidos/nuevo tiene que quedar marcada "Publicar", no "Mis pedidos".
 */
export function PanelNav({ items, variant }: { items: PanelNavItem[]; variant: "top" | "bottom" }) {
  const pathname = usePathname();
  const activo = items
    .filter((i) => [i.href, ...(i.match ?? [])].some((ruta) => coincide(pathname, ruta)))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  if (variant === "top") {
    return (
      <nav aria-label="Panel" className="hidden h-full items-stretch gap-1 lg:flex">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={item.href === activo ? "page" : undefined}
            className={`flex items-center gap-2 border-b-2 px-3 text-base font-medium ${
              item.href === activo
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav
      aria-label="Panel"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background lg:hidden"
    >
      <ul className="mx-auto flex max-w-md">
        {items.map((item) => (
          <li key={item.href} className="flex-1">
            <Link
              href={item.href}
              aria-current={item.href === activo ? "page" : undefined}
              className={`flex min-h-16 flex-col items-center justify-center gap-1 text-sm font-medium ${
                item.href === activo ? "text-primary" : "text-muted"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
