import type { GeoLocation, WeatherSnapshot } from "../types/weather";

type GeocodingResponse = {
  results?: Array<GeoLocation>;
};

type ForecastResponse = {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    is_day: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
  };
};

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export async function searchLocations(query: string): Promise<GeoLocation[]> {
  const params = new URLSearchParams({
    name: query,
    count: "6",
    language: "it",
    format: "json",
  });

  const response = await request(`${GEOCODING_URL}?${params}`, {
    network: "Connessione assente o ricerca localita non raggiungibile.",
    badRequest: "La ricerca non e valida. Prova con il nome di una citta.",
    rateLimit: "Troppe ricerche in poco tempo. Aspetta qualche secondo.",
    unavailable: "La ricerca localita e momentaneamente non disponibile.",
  });

  const data = (await response.json()) as GeocodingResponse;
  return data.results ?? [];
}

export async function getWeather(location: GeoLocation): Promise<WeatherSnapshot> {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
      "wind_direction_10m",
      "is_day",
    ].join(","),
    hourly: [
      "temperature_2m",
      "precipitation_probability",
      "weather_code",
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
      "precipitation_sum",
      "wind_speed_10m_max",
      "sunrise",
      "sunset",
      "uv_index_max",
    ].join(","),
    forecast_days: "7",
    timezone: "auto",
    wind_speed_unit: "kmh",
  });

  const response = await request(`${FORECAST_URL}?${params}`, {
    network: "Connessione assente o servizio meteo non raggiungibile.",
    badRequest: "Coordinate non valide per questa localita.",
    rateLimit: "Troppe richieste meteo in poco tempo. Riprova tra qualche secondo.",
    unavailable: "Il servizio meteo e momentaneamente non disponibile.",
  });

  const data = (await response.json()) as ForecastResponse;

  const nextHours = data.hourly.time
    .map((time, index) => ({
      time,
      temperature: Math.round(data.hourly.temperature_2m[index]),
      precipitationProbability: data.hourly.precipitation_probability[index],
      weatherCode: data.hourly.weather_code[index],
    }))
    .filter((hour) => hour.time >= data.current.time)
    .slice(0, 24);

  return {
    location,
    current: {
      time: data.current.time,
      temperature: Math.round(data.current.temperature_2m),
      apparentTemperature: Math.round(data.current.apparent_temperature),
      humidity: data.current.relative_humidity_2m,
      precipitation: data.current.precipitation,
      weatherCode: data.current.weather_code,
      windSpeed: Math.round(data.current.wind_speed_10m),
      windDirection: data.current.wind_direction_10m,
      isDay: data.current.is_day === 1,
    },
    hourly: nextHours,
    daily: data.daily.time.map((date, index) => ({
      date,
      weatherCode: data.daily.weather_code[index],
      temperatureMax: Math.round(data.daily.temperature_2m_max[index]),
      temperatureMin: Math.round(data.daily.temperature_2m_min[index]),
      precipitationProbability: data.daily.precipitation_probability_max[index],
      precipitationSum: data.daily.precipitation_sum[index],
      windSpeedMax: Math.round(data.daily.wind_speed_10m_max[index]),
      sunrise: data.daily.sunrise[index],
      sunset: data.daily.sunset[index],
      uvIndexMax: Math.round(data.daily.uv_index_max[index]),
    })),
  };
}

type RequestMessages = {
  network: string;
  badRequest: string;
  rateLimit: string;
  unavailable: string;
};

async function request(url: string, messages: RequestMessages) {
  let response: Response;

  try {
    response = await fetch(url);
  } catch {
    throw new Error(messages.network);
  }

  if (response.ok) return response;

  if (response.status === 400) throw new Error(messages.badRequest);
  if (response.status === 429) throw new Error(messages.rateLimit);
  if (response.status >= 500) throw new Error(messages.unavailable);

  throw new Error("Risposta inattesa dal servizio meteo. Riprova tra poco.");
}