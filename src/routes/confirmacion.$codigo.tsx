import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { useDenuncias, formatearFecha } from "@/lib/almacen";
import { nombreCategoria } from "@/lib/datos";
import { StatusBadge } from "@/components/StatusBadge";

export const Route = createFileRoute("/confirmacion/$codigo")({
  head: () => ({
    meta: [
      { title: "Denuncia registrada — USM Denuncias" },
      { name: "description", content: "Tu denuncia fue registrada correctamente." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Denuncia registrada — USM Denuncias" },
      { property: "og:description", content: "Tu denuncia fue registrada correctamente." },
    ],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { codigo } = Route.useParams();
  const lista = useDenuncias();
  if (!lista) return <div className="container page" />;
  const d = lista.find((x) => x.codigo === codigo);
  if (!d)
    return (
      <div className="container page">
        <h1 className="page__title">No encontramos esa denuncia</h1>
        <Link to="/mis-denuncias" className="btn btn--secondary">Ir a Mis denuncias</Link>
      </div>
    );

  return (
    <div className="container page page--narrow">
      <div className="success">
        <CheckCircle2 className="success__icon" size={56} />
        <h1 className="page__title">¡Tu denuncia fue registrada correctamente!</h1>
        <p className="page__lead">Tu número de seguimiento es <strong>{d.codigo}</strong>.</p>
      </div>
      <dl className="summary">
        <div className="summary__row"><dt className="summary__term">Código</dt><dd className="summary__value">{d.codigo}</dd></div>
        <div className="summary__row"><dt className="summary__term">Título</dt><dd className="summary__value">{d.titulo}</dd></div>
        <div className="summary__row"><dt className="summary__term">Categoría</dt><dd className="summary__value">{nombreCategoria(d.categoria)}</dd></div>
        <div className="summary__row"><dt className="summary__term">Ubicación</dt><dd className="summary__value">{d.campus} · {d.ubicacion}</dd></div>
        <div className="summary__row"><dt className="summary__term">Fecha</dt><dd className="summary__value">{formatearFecha(d.fecha, true)}</dd></div>
        <div className="summary__row"><dt className="summary__term">Estado</dt><dd className="summary__value"><StatusBadge estado={d.estado} /></dd></div>
      </dl>
      <div className="actions">
        <Link to="/mis-denuncias/$codigo" params={{ codigo: d.codigo }} className="btn btn--primary">Ver seguimiento</Link>
        <Link to="/" className="btn btn--secondary">Volver al inicio</Link>
        <Link to="/denunciar" className="btn btn--ghost">Crear otra denuncia</Link>
      </div>
    </div>
  );
}
