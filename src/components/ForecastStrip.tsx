import type { WeatherSnapshot } from "../types/weather";
import WeatherIcon from "./WeatherIcon";

type ForecastStripProps = {
  weather: WeatherSnapshot;
};

export default function ForecastStrip({ weather }: ForecastStripProps) {
  return (
    <section className="forecast-section">
      <div className="section-heading">
        <h2>Prossime ore</h2>
        <span>{weather.hourly.length} ore</span>
      </div>

      <div className="hourly-strip">
        {weather.hourly.map((hour) => (
          <article key={hour.time}>
            <time>
              {new Intl.DateTimeFormat("it-IT", {
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(hour.time))}
            </time>
            <WeatherIcon code={hour.weatherCode} size={28} />
            <strong>{hour.temperature}°</strong>
            <small>{hour.precipitationProbability}%</small>
          </article>
        ))}
      </div>
    </section>
  );
}
