import type { ComponentProps, ReactNode } from "react";

// Campos de formulario. Reglas para que sean fáciles de usar:
// - La etiqueta siempre visible arriba del campo (un placeholder desaparece al
//   escribir y deja al usuario sin saber qué estaba completando).
// - Texto de 16px: con menos, el iPhone hace zoom solo al tocar el campo.
// - Alto de 48px, cómodo para el dedo.

const control =
  "block w-full min-h-12 rounded-lg border border-border bg-background px-3 text-base text-foreground " +
  "placeholder:text-muted/70 focus:border-primary focus:outline-2 focus:outline-primary/30 " +
  // Campo marcado con error por el formulario (aria-invalid): borde rojo.
  "aria-invalid:border-danger aria-invalid:outline-danger/30 " +
  "disabled:bg-surface disabled:text-muted";

type FieldProps = {
  label: string;
  htmlFor: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
};

/** Etiqueta + campo + ayuda opcional. */
export function Field({ label, htmlFor, hint, optional, children }: FieldProps) {
  const hintId = hint ? `${htmlFor}-ayuda` : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-base font-medium">
        {label}
        {optional && <span className="font-normal text-muted"> (opcional)</span>}
      </label>
      {children}
      {hint && (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={[control, className].filter(Boolean).join(" ")} {...props} />;
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <select className={[control, "pr-8", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </select>
  );
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={[control, "min-h-28 py-3", className].filter(Boolean).join(" ")} {...props} />;
}
