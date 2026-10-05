import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { getSesionOpcional, inicioDeRol } from "@/lib/sesion";
import { RegistroForm } from "./components/registro-form";

export const metadata: Metadata = { title: "Crear cuenta" };

export default async function RegistroPage({ searchParams }: PageProps<"/registro">) {
  const usuario = await getSesionOpcional();
  if (usuario) redirect(inicioDeRol(usuario.rol));

  const rolInicial = (await searchParams).rol === "revendedor" ? "revendedor" : "comprador";

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-10 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight">Creá tu cuenta</h1>
      <p className="mt-2 text-base text-muted">Es gratis y te lleva un minuto.</p>

      <Card className="mt-6">
        <RegistroForm rolInicial={rolInicial} />
      </Card>

      <p className="mt-6 text-center text-base text-muted">
        ¿Ya tenés cuenta?{" "}
        <Link href="/ingresar" className="font-semibold text-primary">
          Ingresá
        </Link>
      </p>
    </div>
  );
}
