import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useDenuncias, formatearFecha } from "@/lib/almacen";
import { ESTADOS, nombreCategoria } from "@/lib/datos";
import { StatusBadge } from "@/components/StatusBadge";

export const Route = createFileRoute("/mis-denuncias/$codigo")({
  head: ({ params }) => ({
    meta: [
      { title: `Denuncia ${params.codigo} — USM Denuncias` },
      { name: "description", content: "Detalle y seguimiento de tu denuncia." },
      { property: "og:title", content: `Denuncia ${params.codigo}` },
      { property: "og:description", content: "Detalle y seguimiento de tu denuncia." },
    ],
  }),
  component: ReportDetailPage,
});

function ReportDetailPage() {
  const { codigo } = Route.useParams();
  const lista = useDenuncias();
  if (!lista) return <div className="container page" />;
  const d = lista.find((x) => x.codigo === codigo);
  const volver = <Link to="/mis-denuncias" className="back"><ArrowLeft size={18} /> Volver a Mis denuncias</Link>;
  if (!d) return <div className="container page">{volver}<h1 className="page__title">No encontramos la denuncia {codigo}</h1></div>;

  const indiceActual = ESTADOS.indexOf(d.estado);

  return (
    <div className="container page page--narrow">
      {volver}
      <div className="card__meta"><span className="card__code">{d.codigo}</span><StatusBadge estado={d.estado} /></div>
      <h1 className="page__title">{d.titulo}</h1>
      <p className="page__lead">{d.descripcion}</p>

      <dl className="summary">
        <div className="summary__row"><dt className="summary__term">Categoría</dt><dd className="summary__value">{nombreCategoria(d.categoria)}</dd></div>
        <div className="summary__row"><dt className="summary__term">Campus</dt><dd className="summary__value">{d.campus}</dd></div>
        <div className="summary__row"><dt className="summary__term">Ubicación</dt><dd className="summary__value">{d.ubicacion}</dd></div>
        <div className="summary__row"><dt className="summary__term">Fecha</dt><dd className="summary__value">{formatearFecha(d.fecha, true)}</dd></div>
      </dl>
      {d.imagen && <img src={d.imagen} alt="Imagen adjunta a la denuncia" className="preview__img" />}

      {d.solucion && (
        <div className="solution">
          <CheckCircle2 size={22} />
          <div><h2 className="solution__title">Solución entregada</h2><p>{d.solucion}</p></div>
        </div>
      )}

      <h2 className="section-title">Seguimiento</h2>
      <ol className="timeline">
        {ESTADOS.map((e, i) => {
          const evento = d.historial.find((h) => h.estado === e);
          const clase = i < indiceActual ? "timeline__item--done" : i === indiceActual ? "timeline__item--current" : "";
          return (
            <li key={e} className={`timeline__item ${clase}`}>
              <span className="timeline__dot" />
              <div>
                <p className="timeline__title">{e}</p>
                {evento ? (
                  <>
                    <p className="timeline__date">{formatearFecha(evento.fecha, true)}</p>
                    <p className="timeline__text">{evento.detalle}</p>
                  </>
                ) : (
                  <p className="timeline__date">Pendiente</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
