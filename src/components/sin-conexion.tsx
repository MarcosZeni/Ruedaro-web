/**
 * Cuando la API no contesta y la página se muestra igual, sin sus datos. Mejor
 * esto que una página de error entera: el usuario ve el sitio y sabe que es
 * momentáneo.
 */
export function SinConexion({ que = "los vehículos" }: { que?: string }) {
  return (
    <div role="status" className="rounded-xl border border-warning/20 bg-warning-soft p-5 text-base">
      <p className="font-semibold text-warning">No pudimos cargar {que}</p>
      <p className="mt-1 text-foreground">Es un problema momentáneo de nuestro lado. Probá de nuevo en unos minutos.</p>
    </div>
  );
}
