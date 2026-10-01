"use client";

import { useState } from "react";
import { Input } from "@/components/ui/field";
import type { Cotizacion, Moneda } from "@/lib/types";

type Props = {
  /** Nombre del campo del monto; la moneda va en `moneda`. */
  name: string;
  label: string;
  hint?: string;
  defaultMoneda?: Moneda;
  /** Dólar oficial del día. Sin él, no se muestra el equivalente y el formulario anda igual. */
  cotizacion?: Cotizacion | null;
};

const numero = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

/**
 * Monto + moneda, con el equivalente en la otra moneda calculado en vivo.
 *
 * La moneda son dos botones grandes y no un desplegable: en autos usados se
 * habla en dólares y en pesos, y equivocarse es carísimo, así que tiene que
 * estar a la vista. El equivalente ("≈ USD 9.888") confirma de un vistazo que
 * no se le escapó un cero.
 *
 * El monto acepta puntos ("9.000") porque así lo escribe la gente; la Server
 * Action los saca. La conversión que vale es la que hace la API al publicar,
 * con la cotización de ese momento; esta es solo para que el usuario vea.
 */
export function PrecioInput({ name, label, hint, defaultMoneda = "USD", cotizacion }: Props) {
  const [moneda, setMoneda] = useState<Moneda>(defaultMoneda);
  const [monto, setMonto] = useState("");
  const hintId = hint ? `${name}-ayuda` : undefined;

  const valor = Number(monto.replace(/\D/g, ""));
  let equivalente = "";
  if (cotizacion && valor > 0) {
    equivalente =
      moneda === "ARS"
        ? `≈ USD ${numero.format(Math.round(valor / cotizacion.valor))}`
        : `≈ $ ${numero.format(Math.round(valor * cotizacion.valor))}`;
  }

  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-1.5 text-base font-medium">{label}</legend>

      <div className="grid grid-cols-2 gap-2">
        {(["USD", "ARS"] as const).map((m) => (
          <label key={m} className="cursor-pointer">
            <input
              type="radio"
              name="moneda"
              value={m}
              checked={moneda === m}
              onChange={() => setMoneda(m)}
              className="peer sr-only"
            />
            <span className="flex min-h-12 items-center justify-center rounded-lg border border-border text-base font-medium peer-checked:border-primary peer-checked:bg-primary-soft peer-checked:text-primary peer-focus-visible:outline-2 peer-focus-visible:outline-primary">
              {m === "USD" ? "Dólares (USD)" : "Pesos ($)"}
            </span>
          </label>
        ))}
      </div>

      <Input
        id={name}
        name={name}
        aria-label={`${label}, monto`}
        aria-describedby={[hintId, `${name}-equivalente`].filter(Boolean).join(" ")}
        required
        inputMode="numeric"
        pattern="[0-9.]+"
        title="Solo números, por ejemplo 9.000"
        placeholder={moneda === "USD" ? "Ej: 9.000" : "Ej: 15.000.000"}
        autoComplete="off"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
        className="mt-1"
      />

      {/* aria-live: el lector de pantalla anuncia el equivalente a medida que se escribe. */}
      <p id={`${name}-equivalente`} aria-live="polite" className="min-h-6 text-base font-medium text-primary">
        {equivalente}
      </p>
      {cotizacion && (
        <p className="text-sm text-muted">
          Dólar oficial (BCRA) del {new Date(`${cotizacion.fecha}T12:00:00`).toLocaleDateString("es-AR")}: $
          {numero.format(cotizacion.valor)}
        </p>
      )}
      {hint && (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      )}
    </fieldset>
  );
}
