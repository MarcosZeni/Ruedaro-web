"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { cerrarPedido } from "@/lib/contenido-actions";

/**
 * Cerrar el pedido, en dos pasos: primero el botón, después el motivo. El
 * motivo ES la confirmación: no hace falta un "¿Estás seguro?" aparte, y de
 * paso nos dice si el sitio sirvió. Si sale bien, la acción vuelve a Mis
 * pedidos con el aviso.
 */
export function CerrarPedido({ pedidoId }: { pedidoId: string }) {
  const [eligiendo, setEligiendo] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  const cerrar = (motivo: "encontrado" | "ya_no_busca") =>
    startTransition(async () => {
      const r = await cerrarPedido(pedidoId, motivo);
      if (r?.error) setError(r.error);
    });

  return (
    <section aria-labelledby="cerrar" className="mt-10 rounded-xl border border-border bg-surface p-5">
      <h2 id="cerrar" className="text-lg font-semibold">
        ¿Ya no lo buscás?
      </h2>

      {!eligiendo ? (
        <>
          <p className="mt-1 text-base text-muted">
            Al cerrar el pedido, los revendedores dejan de verlo y no te llegan más ofertas.
          </p>
          <Button variant="secondary" size="lg" className="mt-4 w-full sm:w-auto" onClick={() => setEligiendo(true)}>
            Cerrar pedido
          </Button>
        </>
      ) : (
        <>
          <p className="mt-1 mb-4 text-base text-muted">Contanos por qué, así lo cerramos:</p>
          <FormError mensaje={error} />
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <Button size="lg" disabled={pending} onClick={() => cerrar("encontrado")}>
              Ya lo encontré
            </Button>
            <Button variant="secondary" size="lg" disabled={pending} onClick={() => cerrar("ya_no_busca")}>
              Ya no busco
            </Button>
            <Button variant="ghost" size="lg" disabled={pending} onClick={() => setEligiendo(false)}>
              Cancelar
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
