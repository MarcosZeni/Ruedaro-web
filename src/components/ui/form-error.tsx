/**
 * Mensaje de error de un formulario, arriba de todo y en palabras simples. Con
 * role="alert" el lector de pantalla lo lee apenas aparece.
 */
export function FormError({ mensaje }: { mensaje?: string }) {
  if (!mensaje) return null;
  return (
    <p role="alert" className="rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-base font-medium text-danger">
      {mensaje}
    </p>
  );
}
