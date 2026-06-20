import { useState } from "react";
import { Droplets, Sun, Sunrise, Sunset, Umbrella, Wind } from "lucide-react";
import type { WeatherSnapshot } from "../types/weather";
import { getWeatherDescription } from "../services/weatherCodes";
import WeatherIcon from "./WeatherIcon";

type DailyForecastProps = {
  weather: WeatherSnapshot;
};

export default function DailyForecast({ weather }: DailyForecastProps) {
  const [selectedDate, setSelectedDate] = useState(weather.daily[0]?.date ?? "");

  return (
    <section className="forecast-section">
      <div className="section-heading">
        <h2>Settimana</h2>
        <span>7 giorni</span>
      </div>

      <div className="daily-list">
        {weather.daily.map((day) => {
          const description = getWeatherDescription(day.weatherCode);
          const isSelected = selectedDate === day.date;
          const dayIndex = weather.daily.findIndex((item) => item.date === day.date);
          const dayLabel =
            dayIndex === 0
              ? "Oggi"
              : dayIndex === 1
                ? "Domani"
                : new Intl.DateTimeFormat("it-IT", {
                    weekday: "long",
                  }).format(new Date(day.date));

          return (
            <article className={isSelected ? "is-open" : ""} key={day.date}>
              <button
                className="day-summary"
                type="button"
                onClick={() => setSelectedDate(isSelected ? "" : day.date)}
              >
                <div className="day-name">
                  <WeatherIcon code={day.weatherCode} size={30} />
                  <div>
                    <strong>{dayLabel}</strong>
                    <span>{description.label}</span>
                  </div>
                </div>
                <div className="day-values">
                  <span>{day.temperatureMin}&deg;</span>
                  <strong>{day.temperatureMax}&deg;</strong>
                  <small>
                    <Wind size={15} />
                    {day.windSpeedMax} km/h
                  </small>
                </div>
              </button>

              {isSelected && (
                <div className="day-details">
                  <span>
                    <Umbrella size={16} />
                    Pioggia {day.precipitationProbability}%
                  </span>
                  <span>
                    <Droplets size={16} />
                    Accumulo {day.precipitationSum} mm
                  </span>
                  <span>
                    <Sun size={16} />
                    UV {day.uvIndexMax}
                  </span>
                  <span>
                    <Sunrise size={16} />
                    Alba{" "}
                    {new Intl.DateTimeFormat("it-IT", {
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(day.sunrise))}
                  </span>
                  <span>
                    <Sunset size={16} />
                    Tramonto{" "}
                    {new Intl.DateTimeFormat("it-IT", {
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(day.sunset))}
                  </span>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

