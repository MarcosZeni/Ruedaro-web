"use server";

import { redirect } from "next/navigation";

/**
 * Guarda nombre y WhatsApp.
 *
 * Demo: todavía no guarda. Cuando esté el endpoint: validar con zod (el
 * teléfono se normaliza a E.164: 11 2233 4455 pasa a 5491122334455) y mandar
 * con apiFetch. El email no se cambia acá: necesita verificar el nuevo.
 */
export async function guardarCuenta(formData: FormData) {
  void formData;
  redirect("/cuenta?guardado=1");
}
