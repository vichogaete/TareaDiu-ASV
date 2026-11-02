import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ImagePlus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { CAMPUS, CATEGORIAS, nombreCategoria } from "@/lib/datos";
import { borrador, guardarDenuncia } from "@/lib/almacen";

export const Route = createFileRoute("/denunciar")({
  validateSearch: (s: Record<string, unknown>): { categoria?: string } =>
    typeof s["categoria"] === "string" ? { categoria: s["categoria"] } : {},
  head: () => ({
    meta: [
      { title: "Crear denuncia — USM Denuncias" },
      { name: "description", content: "Reporta un problema del campus en tres pasos simples." },
      { property: "og:title", content: "Crear denuncia — USM Denuncias" },
      { property: "og:description", content: "Reporta un problema del campus en tres pasos simples." },
    ],
  }),
  component: ReportForm,
});

type Campos = { categoria: string; campus: string; ubicacion: string; titulo: string; descripcion: string; imagen: string };
const vacio: Campos = { categoria: "", campus: "", ubicacion: "", titulo: "", descripcion: "", imagen: "" };
const PASOS = ["¿Qué tipo de problema?", "Cuéntanos el problema", "Revisa y envía"];

function ReportForm() {
  const { categoria: categoriaInicial } = Route.useSearch();
  const navegar = useNavigate();
  const [paso, setPaso] = useState(0);
  const [datos, setDatos] = useState<Campos>(vacio);
  const [errores, setErrores] = useState<{ [K in keyof Campos]?: string | undefined }>({});
  const [listo, setListo] = useState(false);

  // Recupera el borrador guardado al volver a la página
  useEffect(() => {
    const guardado = borrador.leer();
    setDatos({ ...vacio, ...guardado, ...(categoriaInicial ? { categoria: categoriaInicial } : {}) });
    setPaso(Number(guardado["paso"]) || 0);
    setListo(true);
  }, [categoriaInicial]);

  useEffect(() => {
    if (listo) borrador.guardar({ ...datos, paso: String(paso) });
  }, [datos, paso, listo]);

  const cambiar = (campo: keyof Campos, valor: string) => {
    setDatos((d) => ({ ...d, [campo]: valor }));
    setErrores((e) => ({ ...e, [campo]: undefined }));
  };

  const validar = (p: number) => {
    const e: { [K in keyof Campos]?: string } = {};
    if (p === 0) {
      if (!datos.categoria) e.categoria = "Selecciona una categoría.";
      if (!datos.campus) e.campus = "Selecciona el campus.";
    }
    if (p === 1) {
      if (datos.ubicacion.trim().length < 3) e.ubicacion = "Indica dónde ocurre (ej: Edificio B, sala B-102).";
      if (datos.titulo.trim().length < 5) e.titulo = "Escribe un título de al menos 5 caracteres.";
      if (datos.descripcion.trim().length < 15) e.descripcion = "Describe el problema con al menos 15 caracteres.";
    }
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const continuar = () => validar(paso) && setPaso(paso + 1);

  const elegirImagen = (archivo?: File) => {
    if (!archivo) return;
    if (!archivo.type.startsWith("image/")) return setErrores({ imagen: "El archivo debe ser una imagen." });
    if (archivo.size > 3 * 1024 * 1024) return setErrores({ imagen: "La imagen debe pesar menos de 3 MB." });
    // Reduce la imagen para que quepa en el almacenamiento del navegador
    const img = new Image();
    img.onload = () => {
      const escala = Math.min(1, 900 / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = img.width * escala;
      c.height = img.height * escala;
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      cambiar("imagen", c.toDataURL("image/jpeg", 0.75));
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(archivo);
  };

  const enviar = () => {
    if (!validar(0) || !validar(1)) return;
    const nueva = guardarDenuncia({
      categoria: datos.categoria,
      campus: datos.campus,
      ubicacion: datos.ubicacion.trim(),
      titulo: datos.titulo.trim(),
      descripcion: datos.descripcion.trim(),
      imagen: datos.imagen || undefined,
    });
    borrador.limpiar();
    navegar({ to: "/confirmacion/$codigo", params: { codigo: nueva.codigo } });
  };

  const cancelar = () => {
    if (window.confirm("¿Quieres cancelar? Se borrará lo que escribiste.")) {
      borrador.limpiar();
      navegar({ to: "/" });
    }
  };

  return (
    <div className="container page page--narrow">
      <h1 className="page__title">Crear denuncia</h1>
      <ol className="progress" aria-label="Pasos">
        {PASOS.map((t, i) => (
          <li key={t} className={`progress__step ${i <= paso ? "progress__step--done" : ""}`} aria-current={i === paso ? "step" : undefined}>
            <span className="progress__dot">{i + 1}</span>
            <span className="progress__label">{t}</span>
          </li>
        ))}
      </ol>

      <form className="form" onSubmit={(e) => { e.preventDefault(); if (paso < 2) continuar(); else enviar(); }} noValidate>
        {paso === 0 && (
          <>
            <fieldset className="form__group">
              <legend className="form__label">Categoría *</legend>
              <div className="options">
                {CATEGORIAS.map((c) => (
                  <label key={c.id} className={`option ${datos.categoria === c.id ? "option--selected" : ""}`}>
                    <input type="radio" name="categoria" value={c.id} checked={datos.categoria === c.id} onChange={() => cambiar("categoria", c.id)} className="sr-only" />
                    <span className="option__title">{c.nombre}</span>
                    <span className="option__text">{c.descripcion}</span>
                  </label>
                ))}
              </div>
              {errores.categoria && <p className="form__error" role="alert">{errores.categoria}</p>}
            </fieldset>
            <div className="form__group">
              <label htmlFor="campus" className="form__label">Campus *</label>
              <select id="campus" className="form__input" value={datos.campus} onChange={(e) => cambiar("campus", e.target.value)}>
                <option value="">Selecciona tu campus</option>
                {CAMPUS.map((c) => <option key={c}>{c}</option>)}
              </select>
              {errores.campus && <p className="form__error" role="alert">{errores.campus}</p>}
            </div>
          </>
        )}

        {paso === 1 && (
          <>
            <Campo id="ubicacion" etiqueta="Ubicación específica *" ayuda="Edificio, piso, sala o sector." error={errores.ubicacion}>
              <input id="ubicacion" className="form__input" placeholder="Ej: Edificio B, sala B-102" value={datos.ubicacion} onChange={(e) => cambiar("ubicacion", e.target.value)} />
            </Campo>
            <Campo id="titulo" etiqueta="Título del problema *" ayuda="Una frase corta que resuma el problema." error={errores.titulo}>
              <input id="titulo" className="form__input" maxLength={80} placeholder="Ej: No hay conexión a eduroam" value={datos.titulo} onChange={(e) => cambiar("titulo", e.target.value)} />
            </Campo>
            <Campo id="descripcion" etiqueta="Descripción *" ayuda="¿Qué pasa? ¿Desde cuándo?" error={errores.descripcion}>
              <textarea id="descripcion" className="form__input form__input--area" rows={5} value={datos.descripcion} onChange={(e) => cambiar("descripcion", e.target.value)} />
            </Campo>
            <div className="form__group">
              <span className="form__label">Imagen (opcional)</span>
              {datos.imagen ? (
                <div className="preview">
                  <img src={datos.imagen} alt="Vista previa de la imagen adjunta" className="preview__img" />
                  <button type="button" className="btn btn--ghost" onClick={() => cambiar("imagen", "")}><Trash2 size={18} /> Quitar imagen</button>
                </div>
              ) : (
                <label className="upload">
                  <ImagePlus size={24} />
                  <span>Seleccionar imagen</span>
                  <input type="file" accept="image/*" className="sr-only" onChange={(e) => elegirImagen(e.target.files?.[0])} />
                </label>
              )}
              {errores.imagen && <p className="form__error" role="alert">{errores.imagen}</p>}
            </div>
          </>
        )}

        {paso === 2 && (
          <dl className="summary">
            <Fila t="Categoría" v={nombreCategoria(datos.categoria)} />
            <Fila t="Campus" v={datos.campus} />
            <Fila t="Ubicación" v={datos.ubicacion} />
            <Fila t="Título" v={datos.titulo} />
            <Fila t="Descripción" v={datos.descripcion} />
            {datos.imagen && <img src={datos.imagen} alt="Imagen adjunta" className="preview__img" />}
          </dl>
        )}

        <div className="form__actions">
          <button type="button" className="btn btn--ghost" onClick={cancelar}>Cancelar</button>
          <div className="form__actions-right">
            {paso > 0 && <button type="button" className="btn btn--secondary" onClick={() => setPaso(paso - 1)}>Atrás</button>}
            <button type="submit" className="btn btn--primary">{paso < 2 ? "Continuar" : "Enviar denuncia"}</button>
          </div>
        </div>
      </form>
      <p className="hint">¿Buscas una solución rápida? <Link to="/ayuda" className="link">Revisa el centro de ayuda</Link>.</p>
    </div>
  );
}

function Campo({ id, etiqueta, ayuda, error, children }: { id: string; etiqueta: string; ayuda: string; error?: string | undefined; children: React.ReactNode }) {
  return (
    <div className="form__group">
      <label htmlFor={id} className="form__label">{etiqueta}</label>
      <p className="form__help">{ayuda}</p>
      {children}
      {error && <p className="form__error" role="alert">{error}</p>}
    </div>
  );
}

function Fila({ t, v }: { t: string; v: string }) {
  return (
    <div className="summary__row">
      <dt className="summary__term">{t}</dt>
      <dd className="summary__value">{v}</dd>
    </div>
  );
}
