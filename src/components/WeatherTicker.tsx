import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CloudRain, Newspaper, Sun, Thermometer, Wind } from "lucide-react";
import type { WeatherSnapshot } from "../types/weather";
import { getWeatherDescription } from "../services/weatherCodes";

type FlashItem = {
  icon: "alert" | "rain" | "sun" | "temp" | "wind" | "news";
  text: string;
};

type WeatherTickerProps = {
  weather: WeatherSnapshot;
};

const icons = {
  alert: AlertTriangle,
  rain: CloudRain,
  sun: Sun,
  temp: Thermometer,
  wind: Wind,
  news: Newspaper,
};

export default function WeatherTicker({ weather }: WeatherTickerProps) {
  const flashes = useMemo(() => buildWeatherFlashes(weather), [weather]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [weather.location.id]);

  useEffect(() => {
    if (flashes.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % flashes.length);
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, [flashes.length]);

  const activeFlash = flashes[activeIndex] ?? flashes[0];
  const Icon = icons[activeFlash.icon];

  return (
    <section className="weather-ticker" aria-label="Flash meteo">
      <div className="ticker-label">
        <Newspaper size={17} />
        Flash meteo
      </div>
      <div className="ticker-message" key={activeFlash.text}>
        <Icon size={19} />
        <span>{activeFlash.text}</span>
      </div>
      <div className="ticker-dots" aria-hidden="true">
        {flashes.map((flash, index) => (
          <span
            className={index === activeIndex ? "is-active" : ""}
            key={`${flash.icon}-${flash.text}`}
          />
        ))}
      </div>
    </section>
  );
}

function buildWeatherFlashes(weather: WeatherSnapshot): FlashItem[] {
  const nextRain = weather.hourly.find((hour) => hour.precipitationProbability >= 55);
  const today = weather.daily[0];
  const description = getWeatherDescription(weather.current.weatherCode);
  const flashes: FlashItem[] = [
    {
      icon: "news",
      text: `Ultima ora da ${weather.location.name}: ${description.label.toLowerCase()} e ${weather.current.temperature} gradi, percepiti ${weather.current.apparentTemperature}.`,
    },
  ];

  if (nextRain) {
    flashes.push({
      icon: "rain",
      text: `Pioggia sotto osservazione: probabilita al ${nextRain.precipitationProbability}% verso le ${formatHour(nextRain.time)}.`,
    });
  }

  if (weather.current.windSpeed >= 25 || (today?.windSpeedMax ?? 0) >= 35) {
    flashes.push({
      icon: "wind",
      text: `Vento protagonista: ora ${weather.current.windSpeed} km/h, picco previsto ${today?.windSpeedMax ?? weather.current.windSpeed} km/h.`,
    });
  }

  if ((today?.uvIndexMax ?? 0) >= 6) {
    flashes.push({
      icon: "sun",
      text: `Sole da rispettare: indice UV massimo ${today?.uvIndexMax}, meglio evitare le ore centrali.`,
    });
  }

  if (Math.abs(weather.current.temperature - weather.current.apparentTemperature) >= 3) {
    flashes.push({
      icon: "temp",
      text: `Sensazione diversa dal termometro: ${weather.current.temperature} gradi reali, ${weather.current.apparentTemperature} percepiti.`,
    });
  }

  if ((today?.precipitationProbability ?? 0) >= 60 && !nextRain) {
    flashes.push({
      icon: "alert",
      text: `Giornata instabile: probabilita pioggia massima al ${today?.precipitationProbability}%.`,
    });
  }

  if (flashes.length === 1 && today) {
    flashes.push({
      icon: "temp",
      text: `Escursione prevista oggi: minima ${today.temperatureMin}, massima ${today.temperatureMax} gradi.`,
    });
  }

  return flashes.slice(0, 5);
}

function formatHour(value: string) {
  return new Intl.DateTimeFormat("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
