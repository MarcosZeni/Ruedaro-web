import type { Metadata } from "next";
import { IconLogout } from "@/components/icons";
import { PageTitle } from "@/components/panel/page-title";
import { SelectorTema } from "@/components/selector-tema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireRol } from "@/lib/sesion";
import { cerrarSesion } from "@/lib/sesion-actions";
import { DatosForm } from "./components/datos-form";

export const metadata: Metadata = { title: "Mi cuenta" };

/** 5491122334455 → "11 2233 4455", como lo escribe la gente. */
function telefonoLocal(e164?: string | null): string {
  if (!e164) return "";
  const local = e164.replace(/^549/, "");
  return local.length === 10 ? `${local.slice(0, 2)} ${local.slice(2, 6)} ${local.slice(6)}` : local;
}

export default async function CuentaPage() {
  const usuario = await requireRol();

  return (
    <>
      <PageTitle title="Mi cuenta" />

      <div className="flex max-w-2xl flex-col gap-6">
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Tus datos</h2>
          <DatosForm
            nombre={usuario.nombre}
            email={usuario.email}
            telefono={telefonoLocal(usuario.telefono)}
            rol={usuario.rol}
          />
        </Card>

        <Card>
          <h2 className="mb-1 text-lg font-semibold">Apariencia</h2>
          <p className="mb-4 text-base text-muted">
            “Automático” usa el mismo modo que tu celular o tu computadora.
          </p>
          <SelectorTema />
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-semibold">Sesión</h2>
          <form action={cerrarSesion}>
            <Button type="submit" variant="secondary" size="lg" className="w-full sm:w-auto">
              <IconLogout className="size-5" />
              Cerrar sesión
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}
