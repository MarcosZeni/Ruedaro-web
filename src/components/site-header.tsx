import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { type MenuAction, MobileMenu, type NavLink } from "@/components/mobile-menu";
import { getSesion, inicioDeRol } from "@/lib/sesion";
import { SITE } from "@/lib/site";

const NAV: NavLink[] = [
  { href: "/vehiculos", label: "Buscar vehículos" },
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/#revendedores", label: "Para revendedores" },
];

export async function SiteHeader() {
  const usuario = await getSesion();

  // Con sesión, un solo botón que lleva a su panel. Sin sesión, la acción
  // principal (publicar) y la secundaria (entrar).
  const actions: MenuAction[] = usuario
    ? [{ href: inicioDeRol(usuario.rol), label: "Ir a mi panel", primary: true }]
    : [
        { href: "/registro?rol=comprador", label: "Publicar pedido", primary: true },
        { href: "/ingresar", label: "Ingresar" },
      ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="text-lg font-bold tracking-tight text-primary">
          {SITE.name}
        </Link>

        {/* Escritorio: links y acciones a la vista. */}
        <nav aria-label="Principal" className="hidden items-center gap-6 md:flex">
          {NAV.map((link) => (
            <Link key={link.href} href={link.href} className="text-base font-medium text-muted hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {[...actions].reverse().map((a) => (
            <ButtonLink key={a.href} href={a.href} variant={a.primary ? "primary" : "ghost"}>
              {a.label}
            </ButtonLink>
          ))}
        </div>

        {/* Celular: todo adentro del menú. */}
        <MobileMenu links={NAV} actions={actions} />
      </div>
    </header>
  );
}
