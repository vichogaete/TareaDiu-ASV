import { useEffect, useState } from "react";
import { DENUNCIAS_EJEMPLO, type Denuncia } from "./datos";

const CLAVE = "usm-denuncias";
const CLAVE_BORRADOR = "usm-denuncias-borrador";

export function leerDenuncias(): Denuncia[] {
  if (typeof window === "undefined") return DENUNCIAS_EJEMPLO;
  try {
    const crudo = localStorage.getItem(CLAVE);
    if (!crudo) {
      localStorage.setItem(CLAVE, JSON.stringify(DENUNCIAS_EJEMPLO));
      return DENUNCIAS_EJEMPLO;
    }
    return JSON.parse(crudo) as Denuncia[];
  } catch {
    return DENUNCIAS_EJEMPLO;
  }
}

// Genera un código único mayor al último existente
export function generarCodigo(lista: Denuncia[]): string {
  const max = lista.reduce((m, d) => Math.max(m, Number(d.codigo.split("-")[1]) || 0), 1040);
  return `USM-${max + 1}`;
}

export function guardarDenuncia(datos: Omit<Denuncia, "codigo" | "fecha" | "estado" | "historial">): Denuncia {
  const lista = leerDenuncias();
  const fecha = new Date().toISOString();
  const nueva: Denuncia = {
    ...datos,
    codigo: generarCodigo(lista),
    fecha,
    estado: "Recibida",
    historial: [{ estado: "Recibida", fecha, detalle: "Tu denuncia fue registrada." }],
  };
  const actualizada = [nueva, ...lista];
  try {
    localStorage.setItem(CLAVE, JSON.stringify(actualizada));
  } catch {
    // Si la imagen es muy pesada, se guarda sin ella
    nueva.imagen = undefined;
    localStorage.setItem(CLAVE, JSON.stringify([nueva, ...lista]));
  }
  return nueva;
}

// Lee las denuncias solo en el navegador para evitar diferencias con el servidor
export function useDenuncias() {
  const [denuncias, setDenuncias] = useState<Denuncia[] | null>(null);
  useEffect(() => setDenuncias(leerDenuncias()), []);
  return denuncias;
}

export const borrador = {
  leer: (): Record<string, string> => {
    try {
      return JSON.parse(sessionStorage.getItem(CLAVE_BORRADOR) || "{}");
    } catch {
      return {};
    }
  },
  guardar: (d: Record<string, string>) => {
    try {
      sessionStorage.setItem(CLAVE_BORRADOR, JSON.stringify(d));
    } catch {
      /* sin espacio */
    }
  },
  limpiar: () => sessionStorage.removeItem(CLAVE_BORRADOR),
};

export function formatearFecha(iso: string, conHora = false) {
  return new Date(iso).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(conHora ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}
