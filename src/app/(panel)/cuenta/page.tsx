import type { Metadata } from "next";
import { IconLogout } from "@/components/icons";
import { PageTitle } from "@/components/panel/page-title";
import { SelectorTema } from "@/components/selector-tema";
import { SuccessAlert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/field";
import { requireRol } from "@/lib/sesion";
import { cerrarSesion } from "@/lib/sesion-actions";
import { guardarCuenta } from "./actions";

export const metadata: Metadata = { title: "Mi cuenta" };

/** 5491122334455 → "11 2233 4455", como lo escribe la gente. */
function telefonoLocal(e164?: string): string {
  if (!e164) return "";
  const local = e164.replace(/^549/, "");
  return local.length === 10 ? `${local.slice(0, 2)} ${local.slice(2, 6)} ${local.slice(6)}` : local;
}

export default async function CuentaPage({ searchParams }: PageProps<"/cuenta">) {
  const usuario = await requireRol();
  const { guardado } = await searchParams;

  return (
    <>
      <PageTitle title="Mi cuenta" />

      {guardado === "1" && <SuccessAlert title="Guardamos tus datos." />}

      <div className="flex max-w-2xl flex-col gap-6">
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Tus datos</h2>
          <form action={guardarCuenta} className="flex flex-col gap-6">
            <Field label="Nombre" htmlFor="nombre">
              <Input id="nombre" name="nombre" required maxLength={80} defaultValue={usuario.nombre} autoComplete="name" />
            </Field>

            <Field label="Email" htmlFor="email" hint="Para cambiar el email escribinos a soporte.">
              <Input id="email" type="email" value={usuario.email} disabled aria-describedby="email-ayuda" />
            </Field>

            <Field
              label="WhatsApp"
              htmlFor="telefono"
              optional={usuario.rol === "comprador"}
              hint={
                usuario.rol === "revendedor"
                  ? "Es como te escriben los compradores interesados en tus ofertas."
                  : "Con código de área, sin 0 ni 15. Ej: 11 2233 4455."
              }
            >
              <Input
                id="telefono"
                name="telefono"
                type="tel"
                inputMode="tel"
                maxLength={20}
                required={usuario.rol === "revendedor"}
                defaultValue={telefonoLocal(usuario.telefono)}
                autoComplete="tel-national"
                placeholder="11 2233 4455"
                aria-describedby="telefono-ayuda"
              />
            </Field>

            <Button type="submit" size="lg" className="w-full sm:w-auto sm:self-start">
              Guardar cambios
            </Button>
          </form>
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
