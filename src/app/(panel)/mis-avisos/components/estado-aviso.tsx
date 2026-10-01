"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { cambiarEstadoAviso } from "@/lib/contenido-actions";
import type { EstadoPublicacion } from "@/lib/types";

/**
 * Estado del aviso y lo que se puede hacer con él. "Vendido" es definitivo y
 * lo saca del catálogo, así que pide confirmación; "Pausar" es para cuando lo
 * reservaron o lo están mostrando, y se puede volver atrás.
 */
export function EstadoAviso({ id, estado }: { id: string; estado: EstadoPublicacion }) {
  const [confirmandoVenta, setConfirmandoVenta] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  const cambiar = (nuevo: "activa" | "pausada" | "vendida") =>
    startTransition(async () => {
      const r = await cambiarEstadoAviso(id, nuevo);
      if (r?.error) setError(r.error);
      setConfirmandoVenta(false);
    });

  if (estado === "vendida") return <Badge>Vendido</Badge>;
  if (estado === "baja") return <Badge tone="warning">Dado de baja por moderación</Badge>;

  if (confirmandoVenta) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-base">¿Lo vendiste? Se saca del catálogo y no se puede volver a publicar.</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button disabled={pending} onClick={() => cambiar("vendida")}>
            Sí, lo vendí
          </Button>
          <Button variant="ghost" disabled={pending} onClick={() => setConfirmandoVenta(false)}>
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <FormError mensaje={error} />
      {estado === "activa" ? (
        <Badge tone="success">Publicado</Badge>
      ) : (
        <Badge tone="warning">Pausado: no se ve en el catálogo</Badge>
      )}
      <div className="flex flex-col gap-2 sm:flex-row">
        {estado === "activa" ? (
          <Button variant="secondary" disabled={pending} onClick={() => cambiar("pausada")}>
            Pausar
          </Button>
        ) : (
          <Button disabled={pending} onClick={() => cambiar("activa")}>
            Volver a publicar
          </Button>
        )}
        <Button variant="ghost" disabled={pending} onClick={() => setConfirmandoVenta(true)}>
          Lo vendí
        </Button>
      </div>
    </div>
  );
}
