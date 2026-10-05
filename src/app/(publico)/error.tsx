"use client";

import { Button, ButtonLink } from "@/components/ui/button";

/**
 * Error dentro de las páginas públicas (por ejemplo, el detalle de un vehículo
 * con la API caída). Vive dentro del layout público, así que el header y el
 * footer se siguen viendo y el usuario puede seguir navegando.
 */
export default function ErrorPublico({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="text-3xl font-bold tracking-tight">No pudimos cargar esta página</h1>
      <p className="text-base text-muted">Es un problema momentáneo de nuestro lado. Probá de nuevo en unos segundos.</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button size="lg" onClick={reset}>
          Probar de nuevo
        </Button>
        <ButtonLink href="/" variant="secondary" size="lg">
          Ir al inicio
        </ButtonLink>
      </div>
    </div>
  );
}
