"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { FormError } from "@/components/ui/form-error";
import { PasswordInput } from "@/components/ui/password-input";
import { type FormState, registrarse } from "@/lib/sesion-actions";

const ROLES = [
  { valor: "comprador", titulo: "Busco un vehículo", texto: "Publico qué quiero y recibo ofertas." },
  { valor: "revendedor", titulo: "Vendo vehículos", texto: "Veo pedidos, oferto y publico mis avisos." },
] as const;

/**
 * Formulario de registro. Si la API rechaza algo, vuelve con el mensaje, marca
 * el campo y conserva lo escrito (menos la contraseña, que no se devuelve).
 */
export function RegistroForm({ rolInicial }: { rolInicial: "comprador" | "revendedor" }) {
  const [state, action, pending] = useActionState<FormState, FormData>(registrarse, {});
  const v = state.valores ?? {};
  const invalido = (campo: string) => (state.campo === campo ? true : undefined);

  return (
    <form action={action} className="flex flex-col gap-6">
      <FormError mensaje={state.error} />

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
                defaultChecked={r.valor === (v.rol || rolInicial)}
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
        <Input
          id="nombre"
          name="nombre"
          required
          minLength={2}
          maxLength={80}
          autoComplete="name"
          defaultValue={v.nombre}
          aria-invalid={invalido("nombre")}
          aria-describedby="nombre-ayuda"
        />
      </Field>

      <Field label="Email" htmlFor="email">
        <Input
          id="email"
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          defaultValue={v.email}
          aria-invalid={invalido("email")}
        />
      </Field>

      <Field
        label="WhatsApp"
        htmlFor="telefono"
        hint="Con código de área, sin 0 ni 15. Ej: 11 2233 4455. Si vendés, es obligatorio: es como te contactan."
      >
        <Input
          id="telefono"
          name="telefono"
          type="tel"
          inputMode="tel"
          maxLength={20}
          autoComplete="tel-national"
          placeholder="11 2233 4455"
          defaultValue={v.telefono}
          aria-invalid={invalido("telefono")}
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
          aria-invalid={invalido("password")}
          aria-describedby="password-ayuda"
        />
      </Field>

      {/* Deshabilitado mientras se envía: evita la cuenta duplicada por doble toque. */}
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Creando tu cuenta…" : "Crear cuenta"}
      </Button>
    </form>
  );
}
