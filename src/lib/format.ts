import { infoTipo } from "@/lib/catalogo";
import type { Moneda, TipoVehiculo } from "@/lib/types";

// Formato argentino: punto de miles, sin decimales. "USD 9.000", "$ 25.000.000".
const numero = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

export function formatPrecio(valor: number, moneda: Moneda): string {
  return `${moneda === "USD" ? "USD" : "$"} ${numero.format(valor)}`;
}

/** "62.000 km", o "350 h" si es una lancha. */
export function formatUso(uso: number, tipo: TipoVehiculo): string {
  return `${numero.format(uso)} ${infoTipo(tipo).uso.unidad}`;
}

const relativo = new Intl.RelativeTimeFormat("es-AR", { numeric: "auto" });

/** "hace 2 horas", "ayer", "hace 3 días". */
export function haceCuanto(iso: string, ahora = Date.now()): string {
  const segundos = Math.round((new Date(iso).getTime() - ahora) / 1000);
  const abs = Math.abs(segundos);
  if (abs < 60) return "recién";
  if (abs < 3600) return relativo.format(Math.round(segundos / 60), "minute");
  if (abs < 86400) return relativo.format(Math.round(segundos / 3600), "hour");
  return relativo.format(Math.round(segundos / 86400), "day");
}

/** Link de WhatsApp con un mensaje ya escrito, para que el usuario solo toque "enviar". */
export function linkWhatsApp(telefono: string, mensaje: string): string {
  return `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
}
