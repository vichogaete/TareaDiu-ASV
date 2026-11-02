import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Info } from "lucide-react";
import { ARTICULOS, nombreCategoria } from "@/lib/datos";

export const Route = createFileRoute("/ayuda/$id")({
  loader: ({ params }) => {
    const articulo = ARTICULOS.find((a) => a.id === params.id);
    if (!articulo) throw notFound();
    return articulo;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.titulo} — Centro de ayuda USM` : "Artículo no encontrado" },
      { name: "description", content: loaderData?.resumen ?? "Centro de ayuda USM Denuncias" },
      { property: "og:title", content: loaderData?.titulo ?? "Centro de ayuda" },
      { property: "og:description", content: loaderData?.resumen ?? "Centro de ayuda USM Denuncias" },
    ],
  }),
  notFoundComponent: () => (
    <div className="container page">
      <h1 className="page__title">Artículo no encontrado</h1>
      <Link to="/ayuda" className="btn btn--secondary">Volver al centro de ayuda</Link>
    </div>
  ),
  component: HelpArticlePage,
});

function HelpArticlePage() {
  const a = Route.useLoaderData();
  return (
    <div className="container page page--narrow">
      <Link to="/ayuda" className="back"><ArrowLeft size={18} /> Volver al centro de ayuda</Link>
      <span className="card__tag">{nombreCategoria(a.categoria)}</span>
      <h1 className="page__title">{a.titulo}</h1>
      <p className="page__lead">{a.resumen}</p>
      <ol className="steps">
        {a.pasos.map((p, i) => (
          <li key={i} className="steps__item">
            <span className="steps__number">{i + 1}</span>
            <span>{p}</span>
          </li>
        ))}
      </ol>
      {a.nota && (
        <p className="note"><Info size={18} /> {a.nota}</p>
      )}
      <div className="cta">
        <p>¿Seguiste los pasos y el problema continúa?</p>
        <Link to="/denunciar" search={{ categoria: a.categoria }} className="btn btn--primary">Crear denuncia</Link>
      </div>
    </div>
  );
}
