import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSesionOpcional, inicioDeRol } from "@/lib/sesion";
import { IngresarForm } from "./components/ingresar-form";

export const metadata: Metadata = { title: "Ingresar" };

export default async function IngresarPage() {
  const usuario = await getSesionOpcional();
  if (usuario) redirect(inicioDeRol(usuario.rol));

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight">Ingresá a tu cuenta</h1>

      <Card className="mt-6">
        <IngresarForm />
      </Card>

      {/* Quien llega acá desde "Publicar pedido" puede no tener cuenta: la
          salida tiene que ser tan visible como el formulario. */}
      <div className="mt-8 flex flex-col items-center gap-3 text-center">
        <p className="text-base text-muted">¿Es tu primera vez?</p>
        <ButtonLink href="/registro" variant="secondary" size="lg" className="w-full">
          Crear cuenta gratis
        </ButtonLink>
      </div>
    </div>
  );
}
