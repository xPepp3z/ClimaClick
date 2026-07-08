export default function SiteFooter({ logoSrc }: { logoSrc: string }) {
  return (
    <footer className="site-footer">
      <img className="footer-logo" src={logoSrc} alt="ClimaClick" />
      <section className="footer-block" aria-label="Informazioni progetto">
        <p className="footer-title">ClimaClick</p>
        <p className="footer-copy">&copy; 2026 ClimaClick v1.2.0 <br></br> Tutti i diritti riservati</p>
        <p className="footer-copy">API: Open-Meteo, Open-Meteo Geocoding e RainViewer</p>
        <div className="footer-tags" aria-label="Tecnologie usate">
          <span>React</span>
          <span>TypeScript</span>
          <span>Vite</span>
          <span>Leaflet</span>
        </div>
      </section>
    </footer>
  );
}

