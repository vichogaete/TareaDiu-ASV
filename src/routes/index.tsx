import { createFileRoute, Link } from "@tanstack/react-router";
import { FilePlus2, LifeBuoy, ListChecks, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "USM Denuncias — Reporta problemas en tu campus" },
      { name: "description", content: "Reporta problemas dentro del campus USM, encuentra ayuda y consulta el estado de tus denuncias." },
      { property: "og:title", content: "USM Denuncias" },
      { property: "og:description", content: "Reporta problemas del campus y sigue su estado." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero__inner">
          <h1 className="hero__title">Tu opinión ayuda a mejorar la universidad.</h1>
          <p className="hero__text">
            Reporta problemas dentro del campus, encuentra ayuda y consulta el estado de tus denuncias.
          </p>
        </div>
      </section>
      <section className="container home-grid">
        <article className="access access--featured">
          <FilePlus2 className="access__icon" size={32} />
          <h2 className="access__title">Crear denuncia</h2>
          <p className="access__text">¿Viste algo que no funciona? Cuéntanos en pocos pasos.</p>
          <Link to="/denunciar" className="btn btn--primary">Crear denuncia <ArrowRight size={18} /></Link>
        </article>
        <article className="access">
          <LifeBuoy className="access__icon" size={32} />
          <h2 className="access__title">Centro de ayuda</h2>
          <p className="access__text">Busca soluciones a problemas frecuentes, como eduroam o proyectores.</p>
          <Link to="/ayuda" className="btn btn--secondary">Buscar ayuda</Link>
        </article>
        <article className="access">
          <ListChecks className="access__icon" size={32} />
          <h2 className="access__title">Mis denuncias</h2>
          <p className="access__text">Revisa tus reportes y en qué estado se encuentran.</p>
          <Link to="/mis-denuncias" className="btn btn--secondary">Ver mis denuncias</Link>
        </article>
      </section>
    </>
  );
}
