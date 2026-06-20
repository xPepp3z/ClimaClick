export type WeatherMood = "clear" | "cloudy" | "rain" | "storm" | "snow" | "fog";

const codeMap: Record<number, { label: string; mood: WeatherMood }> = {
  0: { label: "Sereno", mood: "clear" },
  1: { label: "Prevalentemente sereno", mood: "clear" },
  2: { label: "Parzialmente nuvoloso", mood: "cloudy" },
  3: { label: "Coperto", mood: "cloudy" },
  45: { label: "Nebbia", mood: "fog" },
  48: { label: "Nebbia con brina", mood: "fog" },
  51: { label: "Pioviggine leggera", mood: "rain" },
  53: { label: "Pioviggine", mood: "rain" },
  55: { label: "Pioviggine intensa", mood: "rain" },
  56: { label: "Pioviggine gelata", mood: "rain" },
  57: { label: "Pioviggine gelata intensa", mood: "rain" },
  61: { label: "Pioggia leggera", mood: "rain" },
  63: { label: "Pioggia", mood: "rain" },
  65: { label: "Pioggia intensa", mood: "rain" },
  66: { label: "Pioggia gelata", mood: "rain" },
  67: { label: "Pioggia gelata intensa", mood: "rain" },
  71: { label: "Neve leggera", mood: "snow" },
  73: { label: "Neve", mood: "snow" },
  75: { label: "Neve intensa", mood: "snow" },
  77: { label: "Granelli di neve", mood: "snow" },
  80: { label: "Rovesci leggeri", mood: "rain" },
  81: { label: "Rovesci", mood: "rain" },
  82: { label: "Rovesci intensi", mood: "rain" },
  85: { label: "Rovesci nevosi", mood: "snow" },
  86: { label: "Rovesci nevosi intensi", mood: "snow" },
  95: { label: "Temporale", mood: "storm" },
  96: { label: "Temporale con grandine", mood: "storm" },
  99: { label: "Temporale forte con grandine", mood: "storm" },
};

export function getWeatherDescription(code: number) {
  return codeMap[code] ?? { label: "Condizioni variabili", mood: "cloudy" as const };
}
