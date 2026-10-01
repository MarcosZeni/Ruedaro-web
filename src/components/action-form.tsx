"use client";

import Link from "next/link";
import { type FormEvent, type ReactNode, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import type { FormState } from "@/lib/sesion-actions";

export type Popup = { titulo: string; texto: string; link?: { href: string; label: string } };

/**
 * Formulario que manda a una Server Action y, si la API rechaza algo:
 * - muestra el mensaje (arriba y junto al botón, para que se vea esté donde esté
 *   el usuario en la pantalla);
 * - marca el campo con aria-invalid y lo enfoca;
 * - NO borra lo escrito.
 *
 * Por qué onSubmit y no `action={...}`: con `action`, React vacía el formulario
 * cuando la acción termina, aunque haya terminado con error. En un formulario
 * largo, perder todo por un error en un campo es la forma más rápida de que la
 * gente abandone.
 *
 * Mientras envía, todo queda deshabilitado (fieldset): sin doble envío.
 *
 * `popups`: errores que merecen más que una línea roja (por ejemplo, "esa
 * patente ya está publicada"), por código de la API. Se muestran en un diálogo
 * que hay que cerrar: imposible pasarlo por alto.
 */
export function ActionForm({
  action,
  className,
  children,
  popups = {},
}: {
  action: (fd: FormData) => Promise<FormState | void>;
  className?: string;
  children: ReactNode;
  popups?: Record<string, Popup>;
}) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [popup, setPopup] = useState<Popup>();
  const ref = useRef<HTMLFormElement>(null);
  const [errorMsg, setErrorMsg] = useState<string>();
  const [pending, startTransition] = useTransition();

  function marcar(campo?: string) {
    const form = ref.current;
    if (!form) return;
    form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
    if (!campo) return;
    const item = form.elements.namedItem(campo);
    const el = item instanceof RadioNodeList ? (item[0] as HTMLElement | undefined) : (item as HTMLElement | null);
    if (!el) return;
    el.setAttribute("aria-invalid", "true");
    el.focus();
    el.scrollIntoView({ block: "center" });
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const r = await action(fd);
      // Si salió bien, la acción redirige y esto no llega a correr.
      if (r?.error) {
        setErrorMsg(r.error);
        marcar(r.campo);
        const p = r.codigo ? popups[r.codigo] : undefined;
        if (p) {
          setPopup(p);
          dialogo.current?.showModal();
        }
      }
    });
  }

  return (
    <form ref={ref} onSubmit={onSubmit} className={className}>
      <FormError mensaje={errorMsg} />
      <fieldset disabled={pending} className="contents">
        {children}
      </fieldset>
      {errorMsg && (
        <p className="text-base font-medium text-danger" aria-hidden="true">
          {errorMsg}
        </p>
      )}
      {/* <dialog> nativo con showModal(): bloquea el fondo, se cierra con Esc y
          devuelve el foco solo. Sin librería. */}
      <dialog
        ref={dialogo}
        aria-labelledby="popup-titulo"
        className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-xl border border-border bg-background p-6 text-foreground backdrop:bg-black/50"
      >
        {popup && (
          <div className="flex flex-col gap-3">
            <h2 id="popup-titulo" className="text-xl font-bold">
              {popup.titulo}
            </h2>
            <p className="text-base text-muted">{popup.texto}</p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row-reverse">
              <Button type="button" size="lg" onClick={() => dialogo.current?.close()}>
                Entendido
              </Button>
              {popup.link && (
                <Link
                  href={popup.link.href}
                  className="flex min-h-12 items-center justify-center rounded-lg px-4 text-base font-semibold text-primary hover:bg-surface"
                >
                  {popup.link.label}
                </Link>
              )}
            </div>
          </div>
        )}
      </dialog>
      {pending && (
        <p role="status" className="text-base text-muted">
          Enviando…
        </p>
      )}
    </form>
  );
}
