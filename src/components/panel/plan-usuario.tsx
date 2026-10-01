"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { planUsuario } from "@/lib/contenido-actions";

/**
 * Plan de 10 destacados. Mientras no haya cobro integrado, el usuario paga por
 * fuera y el admin lo activa acá por 30 días. Renovar suma 30 días desde hoy.
 */
export function PlanUsuario({ id, planVence }: { id: string; planVence?: string | null }) {
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const vigente = planVence && new Date(planVence) > new Date();

  const aplicar = (dias: number) =>
    startTransition(async () => {
      const r = await planUsuario(id, dias);
      setError(r?.error);
    });

  return (
    <div className="flex flex-col gap-2">
      <FormError mensaje={error} />
      <p className="text-sm text-muted">
        {vigente
          ? `Plan de destacados hasta el ${new Date(planVence!).toLocaleDateString("es-AR")}`
          : "Sin plan de destacados (1 gratis)"}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" disabled={pending} onClick={() => aplicar(30)}>
          {vigente ? "Renovar 30 días" : "Activar plan 30 días"}
        </Button>
        {vigente && (
          <Button variant="ghost" disabled={pending} onClick={() => aplicar(0)}>
            Quitar plan
          </Button>
        )}
      </div>
    </div>
  );
}
