import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost" | "whatsapp" | "danger";
type Size = "md" | "lg";

// min-h-11 = 44px: el alto mínimo de un área táctil cómoda en el celular.
const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover",
  secondary: "border border-border bg-background text-foreground hover:bg-surface",
  ghost: "text-foreground hover:bg-surface",
  whatsapp: "bg-success text-on-primary hover:bg-success-hover",
  danger: "border border-danger/40 bg-background text-danger hover:bg-danger-soft",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-4 text-base",
  lg: "min-h-12 px-6 text-base",
};

type StyleProps = { variant?: Variant; size?: Size };

function classes({ variant = "primary", size = "md" }: StyleProps, extra?: string) {
  return [base, variants[variant], sizes[size], extra].filter(Boolean).join(" ");
}

export function Button({ variant, size, className, ...props }: ComponentProps<"button"> & StyleProps) {
  return <button className={classes({ variant, size }, className)} {...props} />;
}

/** Mismo aspecto que Button, pero navega. Un link que parece botón sigue siendo un link. */
export function ButtonLink({ variant, size, className, ...props }: ComponentProps<typeof Link> & StyleProps) {
  return <Link className={classes({ variant, size }, className)} {...props} />;
}
