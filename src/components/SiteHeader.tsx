import { Link } from "@tanstack/react-router";
import { Menu, X, Megaphone } from "lucide-react";
import { useState } from "react";

const enlaces = [
  { to: "/", texto: "Inicio" },
  { to: "/ayuda", texto: "Centro de ayuda" },
  { to: "/denunciar", texto: "Crear denuncia" },
  { to: "/mis-denuncias", texto: "Mis denuncias" },
] as const;

export function SiteHeader() {
  const [abierto, setAbierto] = useState(false);
  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__brand" onClick={() => setAbierto(false)}>
          <img 
          className="header__escudo" 
          src="/logo.png" 
          alt="Escudo USM"/>

          <span>
            <span className="header__title">USM Denuncias</span>
            <span className="header__subtitle">Universidad Técnica Federico Santa María</span>
          </span>
        </Link>
        <button
          className="header__toggle"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={abierto}
          onClick={() => setAbierto(!abierto)}
        >
          {abierto ? <X /> : <Menu />}
        </button>
        <nav className={`header__nav ${abierto ? "header__nav--open" : ""}`} aria-label="Principal">
          {enlaces.map((e) => (
            <Link
              key={e.to}
              to={e.to}
              className="header__link"
              activeProps={{ className: "header__link--active" }}
              activeOptions={{ exact: e.to === "/" }}
              onClick={() => setAbierto(false)}
            >
              {e.texto}
            </Link>
          ))}
        </nav>
      </div>
      <div className="header__notice">Prototipo académico: no se envían denuncias reales a la universidad.</div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <p className="footer__text">Un campus mejor comienza contigo</p>
      <p className="footer__small">USM Denuncias · Prototipo académico</p>
    </footer>
  );
}
