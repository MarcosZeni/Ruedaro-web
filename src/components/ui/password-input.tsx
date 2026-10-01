"use client";

import { type ComponentProps, useState } from "react";
import { Input } from "@/components/ui/field";

/**
 * Contraseña con botón "Mostrar". En el celular es muy fácil equivocarse al
 * tipear sin ver, y el que se equivoca dos veces abandona el registro.
 */
export function PasswordInput(props: Omit<ComponentProps<"input">, "type">) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input {...props} type={visible ? "text" : "password"} className="pr-24" />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        aria-pressed={visible}
        aria-controls={props.id}
        className="absolute inset-y-1 right-1 rounded-md px-3 text-base font-medium text-primary hover:bg-surface"
      >
        {visible ? "Ocultar" : "Mostrar"}
      </button>
    </div>
  );
}
