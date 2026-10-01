import type { ReactNode } from "react";
import { PanelShell } from "@/components/panel/panel-shell";
import { requireRol } from "@/lib/sesion";

// Un solo layout para los tres paneles: la navegación sale del rol del usuario.
// Cada página además pide su rol con requireRol(...), porque el layout no se
// vuelve a ejecutar al navegar entre páginas del mismo grupo.
export default async function PanelLayout({ children }: { children: ReactNode }) {
  const usuario = await requireRol();
  return <PanelShell usuario={usuario}>{children}</PanelShell>;
}
