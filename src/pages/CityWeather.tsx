import { useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import DailyForecast from "../components/DailyForecast";
import ForecastStrip from "../components/ForecastStrip";
import WeatherOverview from "../components/WeatherOverview";
import WeatherTicker from "../components/WeatherTicker";
import WeatherSkeleton from "../components/WeatherSkeleton";
import ErrorNotice from "../components/ErrorNotice";
import { isFavorite, toggleFavorite } from "../services/favorites";
import { useWeather } from "../hooks/useWeather";
import type { GeoLocation } from "../types/weather";

type RouterState = {
  location?: GeoLocation;
};

export default function CityWeather() {
  const params = useParams();
  const route = useLocation();
  const state = route.state as RouterState | null;

  const latitude = Number(params.latitude);
  const longitude = Number(params.longitude);
  const location: GeoLocation | null =
    state?.location ??
    (Number.isFinite(latitude) && Number.isFinite(longitude)
      ? {
          id: Math.round((latitude + longitude) * 100000),
          name: "Coordinate selezionate",
          latitude,
          longitude,
          country: "Mondo",
        }
      : null);

  const { weather, isLoading, error } = useWeather(location);
  const [, refreshFavoriteState] = useState(0);

  if (!location) {
    return <ErrorNotice title="Coordinate non valide" message="Non riesco a leggere latitudine e longitudine da questo indirizzo." />;
  }

  return (
    <div className="page-grid">
      {isLoading && <WeatherSkeleton />}
      {error && <ErrorNotice title="Meteo non disponibile" message={error} />}
      {weather && (
        <>
          <WeatherOverview
            weather={weather}
            favorite={isFavorite(location)}
            onToggleFavorite={() => {
              toggleFavorite(location);
              refreshFavoriteState((version) => version + 1);
            }}
          />
          <WeatherTicker weather={weather} />
          <ForecastStrip weather={weather} />
          <DailyForecast weather={weather} />
        </>
      )}
    </div>
  );
}

