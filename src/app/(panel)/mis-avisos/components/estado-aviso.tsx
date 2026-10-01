"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EstadoPublicacion } from "@/lib/types";

/**
 * Estado del aviso y lo que se puede hacer con él. "Vendido" es definitivo y
 * lo saca del catálogo; "Pausar" es para cuando lo está mostrando en persona o
 * lo reservaron, y se puede volver atrás.
 *
 * Demo: cambia solo en pantalla. Con la API, cada botón es una Server Action.
 */
export function EstadoAviso({ inicial }: { inicial: EstadoPublicacion }) {
  const [estado, setEstado] = useState(inicial);

  if (estado === "vendida") return <Badge>Vendido</Badge>;

  return (
    <div className="flex flex-col gap-2">
      {estado === "activa" ? (
        <Badge tone="success">Publicado</Badge>
      ) : (
        <Badge tone="warning">Pausado: no se ve en el catálogo</Badge>
      )}
      <div className="flex flex-col gap-2 sm:flex-row">
        {estado === "activa" ? (
          <Button variant="secondary" onClick={() => setEstado("pausada")}>
            Pausar
          </Button>
        ) : (
          <Button onClick={() => setEstado("activa")}>Volver a publicar</Button>
        )}
        <Button variant="ghost" onClick={() => setEstado("vendida")}>
          Lo vendí
        </Button>
      </div>
    </div>
  );
}
