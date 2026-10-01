import { cambiarTema } from "@/lib/tema-actions";
import { getTema, type Tema } from "@/lib/tema";

const OPCIONES: { valor: Tema; label: string }[] = [
  { valor: "auto", label: "Automático" },
  { valor: "claro", label: "Claro" },
  { valor: "oscuro", label: "Oscuro" },
];

/**
 * Tres botones en vez de un interruptor: "Automático" (igual que el celular)
 * tiene que ser una opción visible, no un estado escondido. Cada botón envía el
 * formulario: funciona aunque el JavaScript no haya cargado.
 */
export async function SelectorTema({ compacto = false }: { compacto?: boolean }) {
  const actual = await getTema();

  return (
    <form action={cambiarTema}>
      <fieldset>
        <legend className={compacto ? "sr-only" : "mb-2 text-base font-medium"}>Tema</legend>
        <div className="inline-flex rounded-lg border border-border p-1">
          {OPCIONES.map((op) => (
            <button
              key={op.valor}
              type="submit"
              name="tema"
              value={op.valor}
              aria-pressed={actual === op.valor}
              className={`rounded-md font-medium whitespace-nowrap ${compacto ? "min-h-9 px-3 text-sm" : "min-h-11 px-4 text-base"} ${
                actual === op.valor ? "bg-primary text-on-primary" : "text-muted hover:text-foreground"
              }`}
            >
              {op.label}
            </button>
          ))}
        </div>
      </fieldset>
    </form>
  );
}
