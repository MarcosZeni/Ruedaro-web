"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { moderar } from "@/lib/contenido-actions";

type Tipo = "usuario" | "pedido" | "oferta" | "aviso";

const TEXTOS: Record<Tipo, { activo: string; inactivo: string; bajar: string; subir: string; confirmar: (n: string) => string }> = {
  usuario: {
    activo: "Activo",
    inactivo: "Suspendido",
    bajar: "Suspender",
    subir: "Reactivar",
    confirmar: (n) => `¿Suspender a ${n}? No va a poder entrar y sus pedidos y ofertas dejan de verse.`,
  },
  pedido: {
    activo: "Visible",
    inactivo: "Dado de baja",
    bajar: "Dar de baja",
    subir: "Volver a mostrar",
    confirmar: (n) => `¿Dar de baja el pedido "${n}"? Deja de verse para los revendedores.`,
  },
  oferta: {
    activo: "Visible",
    inactivo: "Dada de baja",
    bajar: "Dar de baja",
    subir: "Volver a mostrar",
    confirmar: (n) => `¿Dar de baja la oferta "${n}"? El comprador deja de verla.`,
  },
  aviso: {
    activo: "Visible",
    inactivo: "No visible",
    bajar: "Dar de baja",
    subir: "Volver a mostrar",
    confirmar: (n) => `¿Dar de baja el aviso "${n}"? Deja de verse en el catálogo.`,
  },
};

const API = {
  usuario: { ruta: "usuarios", alta: "activo", baja: "suspendido" },
  pedido: { ruta: "pedidos", alta: "visible", baja: "baja" },
  oferta: { ruta: "ofertas", alta: "visible", baja: "baja" },
  aviso: { ruta: "publicaciones", alta: "visible", baja: "baja" },
} as const;

/**
 * Estado + acción de moderación. Bajar algo pide confirmación (afecta a otra
 * persona); volver a subirlo no, porque deshace un error. El estado viene del
 * servidor: después de cada acción la página se vuelve a pedir y muestra lo que
 * realmente quedó guardado.
 */
export function Moderar({ tipo, id, nombre, activo }: { tipo: Tipo; id: string; nombre: string; activo: boolean }) {
  const [confirmando, setConfirmando] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const t = TEXTOS[tipo];
  const api = API[tipo];

  const aplicar = (bajar: boolean) =>
    startTransition(async () => {
      const r = await moderar(api.ruta, id, bajar ? api.baja : api.alta);
      setError(r?.error);
      setConfirmando(false);
    });

  if (confirmando) {
    return (
      <div role="alertdialog" aria-label={t.bajar} className="flex w-full flex-col gap-3 rounded-lg bg-danger-soft p-3">
        <p className="text-base">{t.confirmar(nombre)}</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="danger" disabled={pending} onClick={() => aplicar(true)}>
            Sí, {t.bajar.toLowerCase()}
          </Button>
          <Button variant="ghost" disabled={pending} onClick={() => setConfirmando(false)}>
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <FormError mensaje={error} />
      <div className="flex flex-wrap items-center gap-3">
        {activo ? <Badge tone="success">{t.activo}</Badge> : <Badge tone="warning">{t.inactivo}</Badge>}
        {activo ? (
          <Button variant="danger" disabled={pending} onClick={() => setConfirmando(true)}>
            {t.bajar}
          </Button>
        ) : (
          <Button variant="secondary" disabled={pending} onClick={() => aplicar(false)}>
            {t.subir}
          </Button>
        )}
      </div>
    </div>
  );
}
