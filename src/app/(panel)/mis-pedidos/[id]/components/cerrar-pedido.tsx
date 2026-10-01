"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Cerrar el pedido, en dos pasos: primero el botón, después el motivo. El
 * motivo ES la confirmación: no hace falta un "¿Estás seguro?" aparte, y de
 * paso nos dice si el sitio sirvió.
 *
 * Demo: todavía no llama a la API; cuando exista, cada opción es una Server
 * Action que cierra el pedido y vuelve a Mis pedidos.
 */
export function CerrarPedido() {
  const [paso, setPaso] = useState<"inicio" | "motivo" | "listo">("inicio");

  return (
    <section aria-labelledby="cerrar" className="mt-10 rounded-xl border border-border bg-surface p-5">
      <h2 id="cerrar" className="text-lg font-semibold">
        ¿Ya no lo buscás?
      </h2>

      {paso === "inicio" && (
        <>
          <p className="mt-1 text-base text-muted">
            Al cerrar el pedido, los revendedores dejan de verlo y no te llegan más ofertas.
          </p>
          <Button variant="secondary" size="lg" className="mt-4 w-full sm:w-auto" onClick={() => setPaso("motivo")}>
            Cerrar pedido
          </Button>
        </>
      )}

      {paso === "motivo" && (
        <>
          <p className="mt-1 text-base text-muted">Contanos por qué, así lo cerramos:</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button size="lg" onClick={() => setPaso("listo")}>
              Ya lo encontré
            </Button>
            <Button variant="secondary" size="lg" onClick={() => setPaso("listo")}>
              Ya no busco
            </Button>
            <Button variant="ghost" size="lg" onClick={() => setPaso("inicio")}>
              Cancelar
            </Button>
          </div>
        </>
      )}

      {paso === "listo" && (
        <p role="status" className="mt-2 text-base font-medium text-success">
          Pedido cerrado. (Demo: en la versión final se guarda y volvés a Mis pedidos.)
        </p>
      )}
    </section>
  );
}
