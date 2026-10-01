import { Input } from "@/components/ui/field";
import type { Moneda } from "@/lib/types";

type Props = {
  /** Nombre del campo del monto; la moneda va en `moneda`. */
  name: string;
  label: string;
  hint?: string;
  defaultMoneda?: Moneda;
};

/**
 * Monto + moneda. La moneda son dos botones grandes y no un desplegable: en
 * autos usados se habla en dólares y en pesos, y equivocarse es carísimo, así
 * que tiene que estar a la vista.
 *
 * El monto acepta puntos ("9.000") porque así lo escribe la gente; la Server
 * Action los saca antes de convertirlo a número.
 */
export function PrecioInput({ name, label, hint, defaultMoneda = "USD" }: Props) {
  const hintId = hint ? `${name}-ayuda` : undefined;

  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-1.5 text-base font-medium">{label}</legend>

      <div className="grid grid-cols-2 gap-2">
        {(["USD", "ARS"] as const).map((m) => (
          <label key={m} className="cursor-pointer">
            <input type="radio" name="moneda" value={m} defaultChecked={m === defaultMoneda} className="peer sr-only" />
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
        aria-describedby={hintId}
        required
        inputMode="numeric"
        pattern="[0-9.]+"
        title="Solo números, por ejemplo 9.000"
        placeholder="Ej: 9.000"
        autoComplete="off"
        className="mt-1"
      />
      {hint && (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      )}
    </fieldset>
  );
}
