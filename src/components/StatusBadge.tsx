import type { Estado } from "@/lib/datos";

const modificador: Record<Estado, string> = {
  Recibida: "received",
  "En revisión": "review",
  "Derivada al área responsable": "derived",
  Resuelta: "resolved",
};

export function StatusBadge({ estado }: { estado: Estado }) {
  return <span className={`badge badge--${modificador[estado]}`}>{estado}</span>;
}
