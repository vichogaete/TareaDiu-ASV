import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { ARTICULOS, CATEGORIAS, PREGUNTAS, nombreCategoria } from "@/lib/datos";

export const Route = createFileRoute("/ayuda/")({
  head: () => ({
    meta: [
      { title: "Centro de ayuda — USM Denuncias" },
      { name: "description", content: "Encuentra soluciones a problemas frecuentes del campus antes de crear una denuncia." },
      { property: "og:title", content: "Centro de ayuda — USM Denuncias" },
      { property: "og:description", content: "Guías para eduroam, Wi-Fi, proyectores, baños y más." },
    ],
  }),
  component: HelpPage,
});

// Normaliza texto para buscar sin tildes ni mayúsculas
const normalizar = (t: string) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function HelpPage() {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const categoriasConArticulos = CATEGORIAS.filter((c) => ARTICULOS.some((a) => a.categoria === c.id));

  const resultados = useMemo(() => {
    const q = normalizar(busqueda);
    return ARTICULOS.filter(
      (a) =>
        (categoria === "todas" || a.categoria === categoria) &&
        (!q || normalizar(`${a.titulo} ${a.resumen} ${a.pasos.join(" ")}`).includes(q)),
    );
  }, [busqueda, categoria]);

  return (
    <div className="container page">
      <h1 className="page__title">Centro de ayuda</h1>
      <p className="page__lead">Antes de crear una denuncia, revisa si tu problema tiene una solución rápida.</p>

      <label className="search">
        <Search className="search__icon" size={20} />
        <span className="sr-only">Buscar en el centro de ayuda</span>
        <input
          className="search__input"
          type="search"
          placeholder="Ej: eduroam, proyector, baño…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </label>

      <div className="chips" role="group" aria-label="Filtrar por categoría">
        {[{ id: "todas", nombre: "Todas" }, ...categoriasConArticulos].map((c) => (
          <button
            key={c.id}
            className={`chip ${categoria === c.id ? "chip--active" : ""}`}
            aria-pressed={categoria === c.id}
            onClick={() => setCategoria(c.id)}
          >
            {c.nombre}
          </button>
        ))}
      </div>

      <div className="list">
        {resultados.map((a) => (
          <Link key={a.id} to="/ayuda/$id" params={{ id: a.id }} className="card card--link">
            <div>
              <span className="card__tag">{nombreCategoria(a.categoria)}</span>
              <h2 className="card__title">{a.titulo}</h2>
              <p className="card__text">{a.resumen}</p>
            </div>
            <ChevronRight className="card__arrow" />
          </Link>
        ))}
        {resultados.length === 0 && (
          <div className="empty">
            <p>No encontramos artículos para tu búsqueda.</p>
            <Link to="/denunciar" className="btn btn--primary">Crear una denuncia</Link>
          </div>
        )}
      </div>

      <h2 className="section-title">Preguntas frecuentes</h2>
      <div className="faq">
        {PREGUNTAS.map((f) => (
          <details key={f.p} className="faq__item">
            <summary className="faq__question">{f.p}</summary>
            <p className="faq__answer">{f.r}</p>
          </details>
        ))}
      </div>

      <div className="cta">
        <p>¿No encontraste lo que buscabas?</p>
        <Link to="/denunciar" className="btn btn--primary">Crear denuncia</Link>
      </div>
    </div>
  );
}
