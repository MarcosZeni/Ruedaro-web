import { formatPrecio } from "@/lib/format";

const numero = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });
import type { Pedido } from "@/lib/types";

/**
 * Años, presupuesto y zona de un pedido, en casilleros fáciles de leer de un
 * vistazo. En celular van de a dos (la zona abajo, a lo ancho): en tres columnas
 * "2016–2019" y "USD 22.000" se parten en dos renglones.
 */
export function PedidoDatos({ pedido }: { pedido: Pedido }) {
  const anios =
    pedido.anioDesde === pedido.anioHasta ? `${pedido.anioDesde}` : `${pedido.anioDesde}–${pedido.anioHasta}`;

  return (
    <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      <Dato label="Años" valor={anios} />
      <Dato
        label="Hasta"
        valor={formatPrecio(pedido.presupuesto, pedido.moneda)}
        extra={pedido.moneda === "ARS" && pedido.presupuestoUsd ? `≈ USD ${numero.format(pedido.presupuestoUsd)}` : undefined}
      />
      <Dato label="Zona" valor={pedido.zona} className="col-span-2 sm:col-span-1" />
    </dl>
  );
}

function Dato({ label, valor, extra, className = "" }: { label: string; valor: string; extra?: string; className?: string }) {
  return (
    <div className={`rounded-lg bg-surface px-3 py-2 ${className}`}>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-base font-semibold">{valor}</dd>
      {extra && <dd className="text-sm text-muted">{extra}</dd>}
    </div>
  );
}
