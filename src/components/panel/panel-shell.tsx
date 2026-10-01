import Link from "next/link";
import type { ReactNode } from "react";
import {
  IconCar,
  IconHome,
  IconList,
  IconPlus,
  IconSearch,
  IconTag,
  IconUser,
  IconUsers,
} from "@/components/icons";
import { PanelNav, type PanelNavItem } from "@/components/panel/panel-nav";
import { verComo } from "@/lib/sesion-actions";
import { SITE } from "@/lib/site";
import type { Rol, Usuario } from "@/lib/types";

const ROL_LABEL: Record<Rol, string> = {
  comprador: "Comprador",
  revendedor: "Revendedor",
  admin: "Administración",
};

/**
 * Pocas opciones por rol, siempre las mismas y en el mismo lugar. "Mi cuenta"
 * va última en todos, como en las apps.
 */
function itemsDeRol(rol: Rol): PanelNavItem[] {
  const cuenta = { href: "/cuenta", label: "Mi cuenta", icon: <IconUser /> };
  switch (rol) {
    case "comprador":
      return [
        { href: "/mis-pedidos", label: "Mis pedidos", icon: <IconList /> },
        { href: "/mis-pedidos/nuevo", label: "Publicar", icon: <IconPlus /> },
        cuenta,
      ];
    case "revendedor":
      return [
        { href: "/pedidos", label: "Pedidos", icon: <IconSearch /> },
        { href: "/mis-ofertas", label: "Mis ofertas", icon: <IconTag /> },
        { href: "/mis-avisos", label: "Mis avisos", icon: <IconCar /> },
        cuenta,
      ];
    case "admin":
      return [
        { href: "/admin", label: "Resumen", icon: <IconHome /> },
        { href: "/admin/usuarios", label: "Usuarios", icon: <IconUsers /> },
        // Pedidos, ofertas y avisos van juntos, con pestañas: cinco opciones abajo no entran.
        {
          href: "/admin/pedidos",
          label: "Contenido",
          icon: <IconList />,
          match: ["/admin/ofertas", "/admin/avisos"],
        },
        cuenta,
      ];
  }
}

/** Estructura común de los paneles: header, aviso de demo, contenido y navegación. */
export function PanelShell({ usuario, children }: { usuario: Usuario; children: ReactNode }) {
  const items = itemsDeRol(usuario.rol);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-stretch justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg font-bold tracking-tight text-primary">
              {SITE.name}
            </Link>
            <span className="rounded-full bg-surface px-2.5 py-0.5 text-sm font-medium text-muted">
              {ROL_LABEL[usuario.rol]}
            </span>
          </div>
          <PanelNav items={items} variant="top" />
        </div>
      </header>

      <DemoBanner rolActual={usuario.rol} />

      {/* pb-28 en celular: que la barra de abajo no tape el final del contenido. */}
      <main id="contenido" className="mx-auto w-full max-w-5xl flex-1 px-4 pt-6 pb-28 sm:px-6 lg:pb-12">
        {children}
      </main>

      <PanelNav items={items} variant="bottom" />
    </>
  );
}

/** Se borra junto con demo-data.ts y la sesión de demo, cuando haya login real. */
function DemoBanner({ rolActual }: { rolActual: Rol }) {
  return (
    <div className="border-b border-warning/20 bg-warning-soft text-warning">
      <form
        action={verComo}
        className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-2 gap-y-1 px-4 py-2 text-sm sm:px-6"
      >
        <span>
          <strong>Modo demostración:</strong> datos de ejemplo, no se guarda nada. Ver como:
        </span>
        {(Object.keys(ROL_LABEL) as Rol[]).map((rol) => (
          <button
            key={rol}
            type="submit"
            name="rol"
            value={rol}
            aria-pressed={rol === rolActual}
            className={`min-h-8 rounded px-1 underline ${rol === rolActual ? "font-bold no-underline" : "font-semibold"}`}
          >
            {ROL_LABEL[rol].toLowerCase()}
          </button>
        ))}
      </form>
    </div>
  );
}
