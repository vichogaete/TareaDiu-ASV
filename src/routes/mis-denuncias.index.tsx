import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useDenuncias, formatearFecha } from "@/lib/almacen";
import { ESTADOS, nombreCategoria } from "@/lib/datos";
import { StatusBadge } from "@/components/StatusBadge";

export const Route = createFileRoute("/mis-denuncias/")({
  head: () => ({
    meta: [
      { title: "Mis denuncias — USM Denuncias" },
      { name: "description", content: "Revisa tus denuncias y el estado de cada una." },
      { property: "og:title", content: "Mis denuncias — USM Denuncias" },
      { property: "og:description", content: "Revisa tus denuncias y el estado de cada una." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const lista = useDenuncias();
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("todos");
  const q = busqueda.trim().toLowerCase();
  const filtradas = (lista ?? []).filter(
    (d) =>
      (estado === "todos" || d.estado === estado) &&
      (!q || d.titulo.toLowerCase().includes(q) || d.codigo.toLowerCase().includes(q)),
  );

  return (
    <div className="container page">
      <div className="page__head">
        <h1 className="page__title">Mis denuncias</h1>
        <Link to="/denunciar" className="btn btn--primary">Nueva denuncia</Link>
      </div>
      <div className="filters">
        <label className="search">
          <Search className="search__icon" size={20} />
          <span className="sr-only">Buscar por título o código</span>
          <input className="search__input" type="search" placeholder="Buscar por título o código (USM-1031)" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </label>
        <label className="filters__select">
          <span className="sr-only">Filtrar por estado</span>
          <select className="form__input" value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="todos">Todos los estados</option>
            {ESTADOS.map((e) => <option key={e}>{e}</option>)}
          </select>
        </label>
      </div>
      <div className="list">
        {filtradas.map((d) => (
          <Link key={d.codigo} to="/mis-denuncias/$codigo" params={{ codigo: d.codigo }} className="card card--link">
            <div>
              <div className="card__meta">
                <span className="card__code">{d.codigo}</span>
                <StatusBadge estado={d.estado} />
              </div>
              <h2 className="card__title">{d.titulo}</h2>
              <p className="card__text">{nombreCategoria(d.categoria)} · {formatearFecha(d.fecha)}</p>
            </div>
            <ChevronRight className="card__arrow" />
          </Link>
        ))}
        {lista && filtradas.length === 0 && <div className="empty"><p>No hay denuncias que coincidan con tu búsqueda.</p></div>}
      </div>
    </div>
  );
}
