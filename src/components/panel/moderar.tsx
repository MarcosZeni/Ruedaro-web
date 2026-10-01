"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

/**
 * Estado + acción de moderación. Bajar algo pide confirmación (afecta a otra
 * persona); volver a subirlo no, porque deshace un error.
 *
 * Demo: cambia solo en pantalla. Con la API, cada botón es una Server Action
 * y la API registra quién moderó y cuándo.
 */
export function Moderar({ tipo, nombre, activoInicial }: { tipo: Tipo; nombre: string; activoInicial: boolean }) {
  const [activo, setActivo] = useState(activoInicial);
  const [confirmando, setConfirmando] = useState(false);
  const t = TEXTOS[tipo];

  if (confirmando) {
    return (
      <div role="alertdialog" aria-label={t.bajar} className="flex w-full flex-col gap-3 rounded-lg bg-danger-soft p-3">
        <p className="text-base">{t.confirmar(nombre)}</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="danger"
            onClick={() => {
              setActivo(false);
              setConfirmando(false);
            }}
          >
            Sí, {t.bajar.toLowerCase()}
          </Button>
          <Button variant="ghost" onClick={() => setConfirmando(false)}>
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {activo ? <Badge tone="success">{t.activo}</Badge> : <Badge tone="warning">{t.inactivo}</Badge>}
      {activo ? (
        <Button variant="danger" onClick={() => setConfirmando(true)}>
          {t.bajar}
        </Button>
      ) : (
        <Button variant="secondary" onClick={() => setActivo(true)}>
          {t.subir}
        </Button>
      )}
    </div>
  );
}
