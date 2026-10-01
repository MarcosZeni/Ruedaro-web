"use server";

import { redirect } from "next/navigation";

/**
 * Publica un vehículo en el catálogo.
 *
 * Demo: todavía no guarda. Cuando esté el endpoint: validar con zod (tipo,
 * marca del tipo, año, uso y precio positivos), subir las fotos y mandarlo con
 * apiFetch. Las fotos van a necesitar subir el límite de tamaño de las Server
 * Actions.
 */
export async function publicarAviso(formData: FormData) {
  void formData;
  redirect("/mis-avisos?publicado=1");
}
