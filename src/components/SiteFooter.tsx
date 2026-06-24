export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <img
        className="footer-logo"
        src="/ClimaClick Logo Orizzontale Chiaro PNG.png"
        alt="ClimaClick"
      />
      <section className="footer-block" aria-label="Informazioni progetto">
        <p className="footer-title">ClimaClick</p>
        <p className="footer-copy">&copy; 2026 ClimaClick v1.0.1 <br></br> Tutti i diritti riservati.</p>
        <p className="footer-copy">API: Open-Meteo, Open-Meteo Geocoding e RainViewer.</p>
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