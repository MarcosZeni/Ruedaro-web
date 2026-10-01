import Link from "next/link";
import { SelectorTema } from "@/components/selector-tema";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 text-base text-muted sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3">
          <p>
            <span className="font-semibold text-foreground">{SITE.name}</span> · Compraventa de vehículos en Argentina
          </p>
          <nav aria-label="Pie de página" className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/vehiculos" className="hover:text-foreground">
              Buscar vehículos
            </Link>
            <Link href="/#como-funciona" className="hover:text-foreground">
              Cómo funciona
            </Link>
            <Link href="/#revendedores" className="hover:text-foreground">
              Para revendedores
            </Link>
            <Link href="/ingresar" className="hover:text-foreground">
              Ingresar
            </Link>
          </nav>
        </div>
        <SelectorTema compacto />
      </div>
    </footer>
  );
}
