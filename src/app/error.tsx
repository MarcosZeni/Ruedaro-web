"use client";

import { Button } from "@/components/ui/button";

/**
 * Cuando algo falla del lado del servidor (por ejemplo, la API no contesta).
 * Sin detalles técnicos: el usuario no puede hacer nada con un stack trace, y
 * mostrarlo le regala información a quien busca agujeros. El detalle queda en
 * el log del servidor.
 */
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main
      id="contenido"
      className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center"
    >
      <h1 className="text-3xl font-bold tracking-tight">Algo no anduvo bien</h1>
      <p className="text-base text-muted">
        Puede ser un problema momentáneo de nuestro lado. Probá de nuevo en unos segundos.
      </p>
      <Button size="lg" onClick={reset}>
        Probar de nuevo
      </Button>
    </main>
  );
}
