import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchPanel from "../components/SearchPanel";
import WeatherOverview from "../components/WeatherOverview";
import ForecastStrip from "../components/ForecastStrip";
import DailyForecast from "../components/DailyForecast";
import WeatherTicker from "../components/WeatherTicker";
import WeatherSkeleton from "../components/WeatherSkeleton";
import ErrorNotice from "../components/ErrorNotice";
import { isFavorite, toggleFavorite } from "../services/favorites";
import { useWeather } from "../hooks/useWeather";
import type { GeoLocation } from "../types/weather";

const defaultLocation: GeoLocation = {
  id: 3173435,
  name: "Roma",
  latitude: 41.9027,
  longitude: 12.4963,
  country: "Italia",
  admin1: "Lazio",
  timezone: "Europe/Rome",
};

type HomeProps = {
  searchOpen: boolean;
  onSearchOpenChange: (isOpen: boolean) => void;
};

export default function Home({ searchOpen, onSearchOpenChange }: HomeProps) {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] =
    useState<GeoLocation>(defaultLocation);
  const [, refreshFavoriteState] = useState(0);
  const { weather, isLoading, error } = useWeather(selectedLocation);

  function handleSelect(location: GeoLocation) {
    setSelectedLocation(location);
    navigate(`/city/${location.latitude}/${location.longitude}`, {
      state: { location },
    });
  }

  function handleToggleFavorite() {
    toggleFavorite(selectedLocation);
    refreshFavoriteState((version) => version + 1);
  }

  return (
    <div className="page-grid">
      <SearchPanel
        isOpen={searchOpen}
        onOpenChange={onSearchOpenChange}
        onSelect={handleSelect}
      />

      {isLoading && <WeatherSkeleton />}
      {error && <ErrorNotice title="Meteo non disponibile" message={error} />}

      {weather && (
        <>
          <WeatherOverview
            weather={weather}
            favorite={isFavorite(selectedLocation)}
            onToggleFavorite={handleToggleFavorite}
          />
          <WeatherTicker weather={weather} />
          <ForecastStrip weather={weather} />
          <DailyForecast weather={weather} />
        </>
      )}
    </div>
  );
}