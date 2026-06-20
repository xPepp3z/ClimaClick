import { Droplets, Heart, Navigation, Umbrella, Wind } from "lucide-react";
import type { WeatherSnapshot } from "../types/weather";
import { getWeatherDescription } from "../services/weatherCodes";
import WeatherIcon from "./WeatherIcon";

type WeatherOverviewProps = {
  weather: WeatherSnapshot;
  favorite: boolean;
  onToggleFavorite: () => void;
};

export default function WeatherOverview({
  weather,
  favorite,
  onToggleFavorite,
}: WeatherOverviewProps) {
  const description = getWeatherDescription(weather.current.weatherCode);

  return (
    <section className={`weather-hero mood-${description.mood}`}>
      <div className="hero-copy">
        <p className="eyebrow">
          {weather.location.name}
          {weather.location.admin1 ? `, ${weather.location.admin1}` : ""}
        </p>
        <div className="temperature-line">
          <WeatherIcon
            code={weather.current.weatherCode}
            isDay={weather.current.isDay}
            size={58}
          />
          <strong>{weather.current.temperature}°</strong>
        </div>
        <h1>{description.label}</h1>
        <p>
          Percepita {weather.current.apparentTemperature}° <br></br>
          Aggiornato alle{" "}
          {new Intl.DateTimeFormat("it-IT", {
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date(weather.current.time))}
        </p>
      </div>

      <div className="metric-grid">
        <article>
          <Droplets size={20} />
          <span>Umidita</span>
          <strong>{weather.current.humidity}%</strong>
        </article>
        <article>
          <Wind size={20} />
          <span>Vento</span>
          <strong>{weather.current.windSpeed} km/h</strong>
        </article>
        <article>
          <Umbrella size={20} />
          <span>Pioggia</span>
          <strong>{weather.current.precipitation} mm</strong>
        </article>
        <article>
          <Navigation size={20} />
          <span>Direzione</span>
          <strong>{weather.current.windDirection}°</strong>
        </article>
      </div>

      <button
        className={`favorite-button ${favorite ? "is-active" : ""}`}
        type="button"
        onClick={onToggleFavorite}
        title={favorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
      >
        <Heart size={20} fill={favorite ? "currentColor" : "none"} />
      </button>
    </section>
  );
}
