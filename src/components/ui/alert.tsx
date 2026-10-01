import type { ReactNode } from "react";
import { IconCheck } from "@/components/icons";

/**
 * Aviso de que algo salió bien ("Publicamos tu pedido"). Después de cada acción
 * el usuario tiene que ver una confirmación clara; si no, repite el envío o se
 * queda con la duda.
 */
export function SuccessAlert({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div role="status" className="mb-6 flex gap-3 rounded-xl border border-success/20 bg-success-soft p-4 text-success">
      <IconCheck className="size-6 shrink-0" />
      <div>
        <p className="text-base font-semibold">{title}</p>
        {children && <div className="mt-1 text-base">{children}</div>}
      </div>
    </div>
  );
}
