import Link from "next/link";
import type { ReactNode } from "react";
import { IconArrowLeft } from "@/components/icons";

type Props = {
  title: string;
  description?: string;
  /** Link "Volver": en celular no hay barra de direcciones a mano, así que se ofrece siempre. */
  back?: { href: string; label: string };
  /** Acción principal de la pantalla, a la derecha en escritorio y abajo en celular. */
  action?: ReactNode;
};

export function PageTitle({ title, description, back, action }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-4">
      {back && (
        <Link href={back.href} className="-ml-1 flex w-fit items-center gap-1 py-1 text-base font-medium text-muted hover:text-foreground">
          <IconArrowLeft className="size-5" />
          {back.label}
        </Link>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          {description && <p className="mt-1 text-base text-muted">{description}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}
