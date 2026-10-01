import type { ComponentProps } from "react";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={["rounded-xl border border-border bg-background p-5 sm:p-6", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
