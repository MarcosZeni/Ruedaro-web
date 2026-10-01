"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { FormError } from "@/components/ui/form-error";
import { PasswordInput } from "@/components/ui/password-input";
import { type FormState, ingresar } from "@/lib/sesion-actions";

export function IngresarForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(ingresar, {});

  return (
    <form action={action} className="flex flex-col gap-6">
      <FormError mensaje={state.error} />
      <Field label="Email" htmlFor="email">
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={state.valores?.email}
          aria-invalid={state.campo === "email" ? true : undefined}
        />
      </Field>
      <Field label="Contraseña" htmlFor="password">
        <PasswordInput
          id="password"
          name="password"
          required
          autoComplete="current-password"
          aria-invalid={state.campo === "password" ? true : undefined}
        />
      </Field>
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Ingresando…" : "Ingresar"}
      </Button>
    </form>
  );
}
