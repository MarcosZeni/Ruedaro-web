/**
 * Consejo antes de comprar. Es solo un aviso: el sitio no consulta multas ni
 * deudas (los organismos no tienen API abierta y la patente no se muestra en
 * los avisos), así que se le sugiere al comprador pedirla y revisarla él.
 */
export function ConsejoCompra() {
  return (
    <aside className="rounded-xl border border-warning/20 bg-warning-soft p-4 text-base">
      <p className="font-semibold text-warning">Antes de señar</p>
      <p className="mt-1 text-foreground">
        Pedile la patente al vendedor y revisá que no tenga multas ni deuda de patentes, y que no esté prendado ni
        embargado. Se consulta en los sitios oficiales (Seguridad Vial, Rentas de la provincia y Registro del
        Automotor). Y no señes sin ver el vehículo.
      </p>
    </aside>
  );
}
