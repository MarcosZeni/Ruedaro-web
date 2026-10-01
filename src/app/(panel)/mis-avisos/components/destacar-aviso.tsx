"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { destacarAviso } from "@/lib/contenido-actions";

/**
 * Destacar (aparece en el carrusel de la portada) o quitar el destacado. Si no
 * quedan lugares, la API lo dice con un mensaje que explica cómo conseguir más.
 */
export function DestacarAviso({ id, destacada, sinLugar }: { id: string; destacada: boolean; sinLugar: boolean }) {
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  const cambiar = () =>
    startTransition(async () => {
      const r = await destacarAviso(id, !destacada);
      setError(r?.error);
    });

  return (
    <div className="flex flex-col gap-2">
      <FormError mensaje={error} />
      {destacada ? (
        <Button variant="secondary" disabled={pending} onClick={cambiar}>
          ★ Destacado · Quitar
        </Button>
      ) : (
        <Button variant={sinLugar ? "secondary" : "primary"} disabled={pending} onClick={cambiar}>
          ☆ Destacar en la portada
        </Button>
      )}
    </div>
  );
}
