export default function WeatherSkeleton() {
  return (
    <section className="weather-skeleton" aria-label="Caricamento meteo">
      <div className="skeleton-hero">
        <span className="skeleton-line skeleton-short" />
        <span className="skeleton-temp" />
        <span className="skeleton-line" />
      </div>
      <div className="skeleton-metrics">
        <span />
        <span />
        <span />
        <span />
      </div>
    </section>
  );
}