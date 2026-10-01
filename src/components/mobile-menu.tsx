"use client";

import Link from "next/link";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/button";

export type NavLink = { href: string; label: string };

/** Botones del final del menú: la acción principal primero. */
export type MenuAction = { href: string; label: string; primary?: boolean };

/**
 * Menú desplegable para pantallas chicas. Es el único pedazo del header que
 * necesita JavaScript en el navegador; el resto se renderiza en el servidor.
 *
 * Se cierra al tocar cualquier link: el layout no se vuelve a montar al
 * navegar, así que si no lo cerramos a mano queda abierto tapando la página
 * nueva.
 */
export function MobileMenu({ links, actions }: { links: NavLink[]; actions: MenuAction[] }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="menu-movil"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        className="flex size-11 items-center justify-center rounded-lg text-foreground hover:bg-surface"
      >
        <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {open && (
        <div
          id="menu-movil"
          className="absolute inset-x-0 top-16 border-b border-border bg-background px-4 pt-2 pb-6 shadow-lg"
        >
          <nav aria-label="Principal" className="flex flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="flex min-h-12 items-center border-b border-border text-base font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            {actions.map((a) => (
              <ButtonLink key={a.href} href={a.href} variant={a.primary ? "primary" : "secondary"} size="lg" onClick={close}>
                {a.label}
              </ButtonLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
