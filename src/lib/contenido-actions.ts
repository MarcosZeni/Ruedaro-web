"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApiError, apiJson } from "@/lib/api";
import { idValido } from "@/lib/datos";
import type { FormState } from "@/lib/sesion-actions";

// =============================================================================
// Escrituras de pedidos, ofertas, avisos y moderación. La validación que vale
// es la de la API: acá solo se pasan los campos del formulario a JSON y, si la
// API rechaza, se devuelve su mensaje y el campo para marcar.
// =============================================================================

const texto = (fd: FormData, campo: string) => {
  const v = fd.get(campo);
  return typeof v === "string" ? v.trim() : "";
};

/**
 * Número como lo escribe la gente: "9.000", "62 000", "USD 9000" → 9000.
 * Vacío o sin dígitos → null, y la API contesta qué falta.
 */
const numero = (fd: FormData, campo: string): number | null => {
  const digitos = texto(fd, campo).replace(/\D/g, "");
  return digitos ? Number(digitos) : null;
};

function error(e: unknown): FormState {
  if (e instanceof ApiError) return { error: e.message, codigo: e.codigo, campo: e.campo };
  console.error(e);
  return { error: "Algo salió mal. Probá de nuevo." };
}

export async function publicarPedido(fd: FormData): Promise<FormState> {
  try {
    await apiJson("/api/v1/mis-pedidos", {
      method: "POST",
      body: JSON.stringify({
        tipo: texto(fd, "tipo"),
        marca: texto(fd, "marca"),
        modelo: texto(fd, "modelo"),
        anioDesde: numero(fd, "anioDesde"),
        anioHasta: numero(fd, "anioHasta"),
        presupuesto: numero(fd, "presupuesto"),
        moneda: texto(fd, "moneda"),
        zona: texto(fd, "zona"),
        comentarios: texto(fd, "comentarios") || null,
      }),
    });
  } catch (e) {
    return error(e);
  }
  // Fuera del try: redirect() funciona tirando una excepción que Next tiene que ver.
  redirect("/mis-pedidos?publicado=1");
}

export async function enviarOferta(fd: FormData): Promise<FormState> {
  const pedidoId = texto(fd, "pedidoId");
  if (!idValido(pedidoId)) return { error: "No encontramos el pedido." };

  try {
    await apiJson(`/api/v1/pedidos/${pedidoId}/ofertas`, {
      method: "POST",
      body: JSON.stringify({
        marca: texto(fd, "marca"),
        modelo: texto(fd, "modelo"),
        version: texto(fd, "version"),
        anio: numero(fd, "anio"),
        uso: numero(fd, "uso"),
        precio: numero(fd, "precio"),
        moneda: texto(fd, "moneda"),
        link: texto(fd, "link") || null,
        comentario: texto(fd, "comentario") || null,
      }),
    });
  } catch (e) {
    return error(e);
  }
  redirect("/mis-ofertas?enviada=1");
}

export async function publicarAviso(fd: FormData): Promise<FormState> {
  try {
    await apiJson("/api/v1/mis-publicaciones", {
      method: "POST",
      body: JSON.stringify({
        tipo: texto(fd, "tipo"),
        marca: texto(fd, "marca"),
        modelo: texto(fd, "modelo"),
        version: texto(fd, "version"),
        anio: numero(fd, "anio"),
        uso: numero(fd, "uso"),
        precio: numero(fd, "precio"),
        moneda: texto(fd, "moneda"),
        zona: texto(fd, "zona"),
        patente: texto(fd, "patente"),
        descripcion: texto(fd, "descripcion") || null,
      }),
    });
  } catch (e) {
    return error(e);
  }
  redirect("/mis-avisos?publicado=1");
}

export async function cerrarPedido(id: string, motivo: "encontrado" | "ya_no_busca"): Promise<FormState> {
  if (!idValido(id)) return { error: "No encontramos el pedido." };
  try {
    await apiJson(`/api/v1/mis-pedidos/${id}/cerrar`, { method: "POST", body: JSON.stringify({ motivo }) });
  } catch (e) {
    return error(e);
  }
  redirect("/mis-pedidos?cerrado=1");
}

export async function cambiarEstadoAviso(id: string, estado: "activa" | "pausada" | "vendida"): Promise<FormState> {
  if (!idValido(id)) return { error: "No encontramos el aviso." };
  try {
    await apiJson(`/api/v1/mis-publicaciones/${id}/estado`, { method: "POST", body: JSON.stringify({ estado }) });
  } catch (e) {
    return error(e);
  }
  revalidatePath("/mis-avisos");
  return { ok: true };
}

export async function destacarAviso(id: string, destacada: boolean): Promise<FormState> {
  if (!idValido(id)) return { error: "No encontramos el aviso." };
  try {
    await apiJson(`/api/v1/mis-publicaciones/${id}/destacar`, { method: "POST", body: JSON.stringify({ destacada }) });
  } catch (e) {
    return error(e);
  }
  revalidatePath("/mis-avisos");
  return { ok: true };
}

/** Plan de 10 destacados por `dias` (0 lo quita). Lo usa el admin cuando el usuario pagó. */
export async function planUsuario(id: string, dias: number): Promise<FormState> {
  if (!idValido(id)) return { error: "No encontramos el usuario." };
  try {
    await apiJson(`/api/v1/admin/usuarios/${id}/plan`, { method: "POST", body: JSON.stringify({ dias }) });
  } catch (e) {
    return error(e);
  }
  revalidatePath("/admin", "layout");
  return { ok: true };
}

/** Moderación de admin. Usuarios: activo/suspendido; contenido: visible/baja. */
export async function moderar(
  tipo: "usuarios" | "pedidos" | "ofertas" | "publicaciones",
  id: string,
  estado: "activo" | "suspendido" | "visible" | "baja",
): Promise<FormState> {
  if (!idValido(id)) return { error: "No encontramos lo que querés moderar." };
  try {
    await apiJson(`/api/v1/admin/${tipo}/${id}/estado`, { method: "POST", body: JSON.stringify({ estado }) });
  } catch (e) {
    return error(e);
  }
  revalidatePath("/admin", "layout");
  return { ok: true };
}
