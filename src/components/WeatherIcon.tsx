import { Cloud, CloudFog, CloudRain, CloudSnow, CloudSun, Sun, Zap } from "lucide-react";
import { getWeatherDescription } from "../services/weatherCodes";

type WeatherIconProps = {
  code: number;
  isDay?: boolean;
  size?: number;
};

export default function WeatherIcon({ code, isDay = true, size = 42 }: WeatherIconProps) {
  const { mood } = getWeatherDescription(code);
  const className = `weather-icon weather-icon-${mood}`;
  const strokeWidth = size >= 48 ? 2.6 : 2.4;

  if (mood === "clear") {
    return isDay ? (
      <Sun className={className} size={size} strokeWidth={strokeWidth} />
    ) : (
      <CloudSun className={className} size={size} strokeWidth={strokeWidth} />
    );
  }
  if (mood === "rain") {
    return <CloudRain className={className} size={size} strokeWidth={strokeWidth} />;
  }
  if (mood === "storm") {
    return <Zap className={className} size={size} strokeWidth={strokeWidth} />;
  }
  if (mood === "snow") {
    return <CloudSnow className={className} size={size} strokeWidth={strokeWidth} />;
  }
  if (mood === "fog") {
    return <CloudFog className={className} size={size} strokeWidth={strokeWidth} />;
  }
  return <Cloud className={className} size={size} strokeWidth={strokeWidth} />;
}
