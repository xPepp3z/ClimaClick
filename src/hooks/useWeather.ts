import { useEffect, useState } from "react";
import { getWeather } from "../services/openMeteo";
import type { GeoLocation, WeatherSnapshot } from "../types/weather";

export function useWeather(location: GeoLocation | null) {
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location) return;

    let isActive = true;

    setIsLoading(true);
    setError(null);
    setWeather(null);

    getWeather(location)
      .then((data) => {
        if (isActive) setWeather(data);
      })
      .catch((unknownError: unknown) => {
        if (!isActive) return;
        const message =
          unknownError instanceof Error
            ? unknownError.message
            : "Qualcosa e andato storto.";
        setError(message);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [location]);

  return { weather, isLoading, error };
}
