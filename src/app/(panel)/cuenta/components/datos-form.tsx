"use client";

import { useActionState } from "react";
import { SuccessAlert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { FormError } from "@/components/ui/form-error";
import { type FormState, guardarCuenta } from "@/lib/sesion-actions";
import type { Rol } from "@/lib/types";

type Props = { nombre: string; email: string; telefono: string; rol: Rol };

export function DatosForm({ nombre, email, telefono, rol }: Props) {
  const [state, action, pending] = useActionState<FormState, FormData>(guardarCuenta, {});
  const v = state.valores ?? {};
  const invalido = (campo: string) => (state.campo === campo ? true : undefined);

  return (
    <form action={action} className="flex flex-col gap-6">
      {state.ok && <SuccessAlert title="Guardamos tus datos." />}
      <FormError mensaje={state.error} />

      <Field label="Nombre" htmlFor="nombre">
        <Input
          id="nombre"
          name="nombre"
          required
          minLength={2}
          maxLength={80}
          defaultValue={v.nombre ?? nombre}
          autoComplete="name"
          aria-invalid={invalido("nombre")}
        />
      </Field>

      <Field label="Email" htmlFor="email" hint="Para cambiar el email escribinos a soporte.">
        <Input id="email" type="email" value={email} disabled aria-describedby="email-ayuda" />
      </Field>

      <Field
        label="WhatsApp"
        htmlFor="telefono"
        optional={rol === "comprador"}
        hint={
          rol === "revendedor"
            ? "Es como te escriben los compradores interesados. Con código de área, sin 0 ni 15."
            : "Con código de área, sin 0 ni 15. Ej: 11 2233 4455."
        }
      >
        <Input
          id="telefono"
          name="telefono"
          type="tel"
          inputMode="tel"
          maxLength={20}
          required={rol === "revendedor"}
          defaultValue={v.telefono ?? telefono}
          autoComplete="tel-national"
          placeholder="11 2233 4455"
          aria-invalid={invalido("telefono")}
          aria-describedby="telefono-ayuda"
        />
      </Field>

      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto sm:self-start">
        {pending ? "Guardando…" : "Guardar cambios"}
      </Button>
    </form>
  );
}
