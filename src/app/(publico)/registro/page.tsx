import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { getSesion, inicioDeRol } from "@/lib/sesion";
import { registrarse } from "@/lib/sesion-actions";

export const metadata: Metadata = { title: "Crear cuenta" };

const ROLES = [
  { valor: "comprador", titulo: "Busco un auto", texto: "Publico qué auto quiero y recibo ofertas." },
  { valor: "revendedor", titulo: "Vendo autos", texto: "Veo pedidos de compradores y les oferto." },
] as const;

export default async function RegistroPage({ searchParams }: PageProps<"/registro">) {
  const usuario = await getSesion();
  if (usuario) redirect(inicioDeRol(usuario.rol));

  const rolInicial = (await searchParams).rol === "revendedor" ? "revendedor" : "comprador";

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-10 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight">Creá tu cuenta</h1>
      <p className="mt-2 text-base text-muted">Es gratis y te lleva un minuto.</p>

      <Card className="mt-6">
        <form action={registrarse} className="flex flex-col gap-6">
          {/* Lo primero es para qué viene: cambia todo lo que ve después. */}
          <fieldset>
            <legend className="mb-2 text-base font-medium">¿Qué querés hacer?</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {ROLES.map((r) => (
                <label key={r.valor} className="cursor-pointer">
                  <input
                    type="radio"
                    name="rol"
                    value={r.valor}
                    defaultChecked={r.valor === rolInicial}
                    className="peer sr-only"
                  />
                  <span className="flex h-full flex-col gap-1 rounded-xl border-2 border-border p-4 peer-checked:border-primary peer-checked:bg-primary-soft peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary">
                    <span className="text-lg font-semibold">{r.titulo}</span>
                    <span className="text-base text-muted">{r.texto}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <Field label="Nombre" htmlFor="nombre" hint="Si sos agencia, el nombre de la agencia.">
            <Input id="nombre" name="nombre" required maxLength={80} autoComplete="name" aria-describedby="nombre-ayuda" />
          </Field>

          <Field label="Email" htmlFor="email">
            <Input id="email" name="email" type="email" required maxLength={254} autoComplete="email" />
          </Field>

          <Field
            label="WhatsApp"
            htmlFor="telefono"
            optional
            hint="Con código de área, sin 0 ni 15. Ej: 11 2233 4455. Si vendés autos, es como te van a contactar."
          >
            <Input
              id="telefono"
              name="telefono"
              type="tel"
              inputMode="tel"
              maxLength={20}
              autoComplete="tel-national"
              placeholder="11 2233 4455"
              aria-describedby="telefono-ayuda"
            />
          </Field>

          <Field label="Contraseña" htmlFor="password" hint="Mínimo 8 caracteres.">
            <PasswordInput
              id="password"
              name="password"
              required
              minLength={8}
              maxLength={128}
              autoComplete="new-password"
              aria-describedby="password-ayuda"
            />
          </Field>

          <Button type="submit" size="lg">
            Crear cuenta
          </Button>
        </form>
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
